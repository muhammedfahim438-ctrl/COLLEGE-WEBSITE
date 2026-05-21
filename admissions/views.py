import json
import hmac
import hashlib
import razorpay
from io import BytesIO
from datetime import datetime

from django.conf        import settings
from django.http        import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail   import EmailMessage
from django.core.paginator import Paginator

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.lib           import colors
from reportlab.lib.units     import cm
from reportlab.platypus      import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums  import TA_CENTER, TA_LEFT, TA_RIGHT

from .models import AdmissionApplication


# ── Razorpay client ───────────────────────────────────────────────
def get_client():
    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


# -- PDF Receipt Generator -----------------------------------------------
def generate_receipt_pdf(app):
    """Clean single-page PDF receipt."""
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.8*cm, leftMargin=1.8*cm,
        topMargin=1.5*cm,   bottomMargin=1.5*cm,
    )

    NAVY  = colors.HexColor('#003366')
    RED   = colors.HexColor('#cc0000')
    GOLD  = colors.HexColor('#f5a623')
    LGRAY = colors.HexColor('#e8ecf4')
    DARK  = colors.HexColor('#1e1b4b')
    MUTED = colors.HexColor('#64748b')
    GREEN = colors.HexColor('#059669')
    FBG   = colors.HexColor('#f8fafc')

    def para(text, size=10, color=DARK, bold=False, align=TA_LEFT):
        fn = 'Helvetica-Bold' if bold else 'Helvetica'
        st = ParagraphStyle('p', fontName=fn, fontSize=size,
                            textColor=color, alignment=align, leading=size*1.3)
        return Paragraph(str(text) if text else '-', st)

    story = []

    # ── HEADER ──────────────────────────────────────────────────────
    header = Table([
        [para('UNIVERSITY ARTS & SCIENCE COLLEGE', 15, colors.white, True, TA_CENTER)],
        [para('Palakkad, Kerala, India  |  Est. 2011  |  0491 2527770', 9,
              colors.HexColor('#a0b4cc'), False, TA_CENTER)],
    ], colWidths=[17.4*cm])
    header.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), NAVY),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    story.append(header)
    story.append(Spacer(1, 0.3*cm))

    # ── TITLE ───────────────────────────────────────────────────────
    story.append(para('ADMISSION RECEIPT', 14, NAVY, True, TA_CENTER))
    story.append(Spacer(1, 0.1*cm))
    story.append(para('Payment Confirmed', 10, GREEN, False, TA_CENTER))
    story.append(Spacer(1, 0.2*cm))
    story.append(HRFlowable(width='100%', thickness=1.5, color=GOLD, spaceAfter=6))

    # ── APP ID / DATE / AMOUNT ROW ───────────────────────────────────
    app_date = app.created_at.strftime('%d %b %Y, %I:%M %p') if app.created_at else '-'
    id_row = Table([
        [
            para('Application ID', 8, MUTED, False, TA_CENTER),
            para('Date & Time',    8, MUTED, False, TA_CENTER),
            para('Amount Paid',    8, MUTED, False, TA_CENTER),
        ],
        [
            para(f'# {app.id}', 13, NAVY, True, TA_CENTER),
            para(app_date,       10, DARK, True, TA_CENTER),
            para('Rs. 500',      13, GREEN, True, TA_CENTER),
        ],
    ], colWidths=[5.8*cm, 6*cm, 5.6*cm])
    id_row.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), FBG),
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 6),
        ('RIGHTPADDING',  (0,0), (-1,-1), 6),
        ('BOX',           (0,0), (-1,-1), 0.5, LGRAY),
        ('INNERGRID',     (0,0), (-1,-1), 0.5, LGRAY),
    ]))
    story.append(id_row)
    story.append(Spacer(1, 0.25*cm))

    # ── Helper: section header ───────────────────────────────────────
    def sec_head(title):
        t = Table([[para(title, 9, colors.white, True)]], colWidths=[17.4*cm])
        t.setStyle(TableStyle([
            ('BACKGROUND',    (0,0), (-1,-1), NAVY),
            ('TOPPADDING',    (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ]))
        return t

    # ── Helper: info rows ────────────────────────────────────────────
    def info_rows(rows):
        data = [[para(l, 9, MUTED), para(v or '-', 9, DARK, True)] for l, v in rows]
        t = Table(data, colWidths=[5*cm, 12.4*cm])
        t.setStyle(TableStyle([
            ('BACKGROUND',    (0,0), (0,-1), FBG),
            ('TOPPADDING',    (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING',   (0,0), (-1,-1), 10),
            ('RIGHTPADDING',  (0,0), (-1,-1), 8),
            ('LINEBELOW',     (0,0), (-1,-2), 0.4, LGRAY),
            ('BOX',           (0,0), (-1,-1), 0.5, LGRAY),
        ]))
        return t

    # ── PERSONAL ────────────────────────────────────────────────────
    story.append(sec_head('PERSONAL INFORMATION'))
    story.append(info_rows([
        ('Full Name',     app.name),
        ('Email',         app.email),
        ('Phone',         app.phone),
        ('Date of Birth', str(app.date_of_birth) if app.date_of_birth else '-'),
        ('Gender',        app.gender),
        ('Address',       app.address),
    ]))
    story.append(Spacer(1, 0.2*cm))

    # ── PARENTS ─────────────────────────────────────────────────────
    story.append(sec_head('PARENTS DETAILS'))
    story.append(info_rows([
        ("Father's Name",  app.father_name),
        ("Father's Phone", app.father_phone),
        ("Mother's Name",  app.mother_name),
        ("Mother's Phone", app.mother_phone),
    ]))
    story.append(Spacer(1, 0.2*cm))

    # ── ACADEMIC ────────────────────────────────────────────────────
    story.append(sec_head('ACADEMIC INFORMATION'))
    story.append(info_rows([
        ('Course Applied',    app.course),
        ('Qualification',     app.prev_qualification),
        ('Previous Course',   app.prev_course_name or '-'),
        ('Previous College',  app.prev_college_name or '-'),
        ('College Place',     app.prev_college_place or '-'),
        ('Year of Passing',   app.year_of_passing),
    ]))
    story.append(Spacer(1, 0.2*cm))

    # ── PAYMENT ─────────────────────────────────────────────────────
    story.append(sec_head('PAYMENT INFORMATION'))
    story.append(info_rows([
        ('Status',       'PAID'),
        ('Amount',       'Rs. 500'),
        ('Payment ID',   app.razorpay_payment_id or '-'),
        ('Order ID',     app.razorpay_order_id or '-'),
        ('Date',         app_date),
    ]))
    story.append(Spacer(1, 0.3*cm))

    # ── FOOTER ──────────────────────────────────────────────────────
    story.append(HRFlowable(width='100%', thickness=0.5, color=LGRAY, spaceAfter=6))
    ft = ParagraphStyle('ft', fontName='Helvetica', fontSize=7.5,
                        textColor=MUTED, alignment=TA_CENTER, leading=11)
    story.append(Paragraph('This is a computer-generated receipt and does not require a signature.', ft))
    story.append(Paragraph(
        f'University Arts & Science College, Palakkad, Kerala  |  universitycollegepkd@university.com  |  0491 2527770', ft))
    story.append(Paragraph(f'Generated: {datetime.now().strftime("%d %b %Y, %I:%M %p")}', ft))

    doc.build(story)
    buffer.seek(0)
    return buffer


# ── HTML Email Template ───────────────────────────────────────────
def get_confirmation_email_html(app):
    """Beautiful HTML email for student confirmation."""
    app_date = app.created_at.strftime('%d %B %Y, %I:%M %p') if app.created_at else ''
    return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.12);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#003366,#002244);padding:32px 28px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:8px;">🎓</div>
      <h1 style="color:#fff;font-size:1.3rem;margin:0 0 4px;font-weight:800;">
        University Arts & Science College
      </h1>
      <p style="color:rgba(255,255,255,.6);font-size:12px;margin:0;">
        Palakkad, Kerala · Est. 2011
      </p>
    </div>

    <!-- Success Banner -->
    <div style="background:linear-gradient(135deg,#059669,#10b981);padding:18px 28px;text-align:center;">
      <p style="color:#fff;font-size:1.1rem;font-weight:800;margin:0;">
        ✅ Application Confirmed!
      </p>
      <p style="color:rgba(255,255,255,.85);font-size:12px;margin:6px 0 0;">
        Your payment has been received and application submitted successfully.
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px;">
      <p style="color:#1e1b4b;font-size:15px;font-weight:600;margin:0 0 6px;">
        Dear {app.name},
      </p>
      <p style="color:#64748b;font-size:13px;line-height:1.7;margin:0 0 24px;">
        Thank you for applying to University Arts & Science College. Your admission application
        has been successfully submitted and payment confirmed. Please find the receipt PDF attached.
      </p>

      <!-- Application Summary -->
      <div style="background:#f8fafc;border:1.5px solid #e8ecf4;border-radius:12px;overflow:hidden;margin-bottom:24px;">
        <div style="background:#003366;padding:10px 16px;">
          <p style="color:#fff;font-size:11px;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:1px;">
            Application Summary
          </p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          {''.join([f'''
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:10px 16px;font-size:12px;color:#94a3b8;font-weight:600;width:40%;">{label}</td>
            <td style="padding:10px 16px;font-size:13px;color:#1e1b4b;font-weight:700;">{value}</td>
          </tr>''' for label, value in [
            ('Application ID',  f'# {app.id}'),
            ('Course Applied',  app.course),
            ('Amount Paid',     '₹ 500.00'),
            ('Payment ID',      app.razorpay_payment_id or '—'),
            ('Applied On',      app_date),
          ]])}
        </table>
      </div>

      <!-- Fee Receipt Box -->
      <div style="background:linear-gradient(135deg,#003366,#004080);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,.6);font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Amount Paid</p>
        <p style="color:#f5a623;font-size:2rem;font-weight:800;margin:0 0 4px;">₹ 500</p>
        <p style="color:rgba(255,255,255,.7);font-size:11px;margin:0;">Application Fee · Academic Year 2026–27</p>
      </div>

      <!-- Note -->
      <div style="background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
        <p style="color:#92400e;font-size:12px;font-weight:600;margin:0 0 4px;">
          📋 What happens next?
        </p>
        <p style="color:#78350f;font-size:12px;line-height:1.7;margin:0;">
          Our admissions team will review your application and contact you within 3–5 working days
          with further instructions. Please keep this email and the attached receipt for your records.
        </p>
      </div>

      <!-- Contact -->
      <p style="color:#64748b;font-size:12px;line-height:1.8;margin:0;">
        For any queries, contact us:<br>
        📞 <a href="tel:04912527770" style="color:#003366;font-weight:700;">0491 2527770</a><br>
        📧 <a href="mailto:universitycollegepkd@university.com" style="color:#003366;font-weight:700;">universitycollegepkd@university.com</a><br>
        🕐 Mon–Sat: 9:00 AM – 5:00 PM
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e8ecf4;padding:16px 28px;text-align:center;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">
        © 2026 University Arts & Science College, Palakkad, Kerala
      </p>
      <p style="color:#94a3b8;font-size:10px;margin:4px 0 0;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>

  </div>
</body>
</html>
"""


# ── Create Razorpay Order ─────────────────────────────────────────
@csrf_exempt
def create_order(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data   = json.loads(request.body)
        client = get_client()

        order = client.order.create({
            'amount':   50000,  # ₹500 in paise
            'currency': 'INR',
            'payment_capture': 1,
        })

        app = AdmissionApplication.objects.create(
            name               = data.get('name', '').strip(),
            email              = data.get('email', '').strip(),
            phone              = data.get('phone', '').strip(),
            date_of_birth      = data.get('date_of_birth'),
            gender             = data.get('gender', ''),
            address            = data.get('address', '').strip(),
            father_name        = data.get('father_name', '').strip(),
            father_phone       = data.get('father_phone', '').strip(),
            mother_name        = data.get('mother_name', '').strip(),
            mother_phone       = data.get('mother_phone', '').strip(),
            course             = data.get('course', '').strip(),
            prev_qualification = data.get('prev_qualification', ''),
            prev_course_name   = data.get('prev_course_name', '').strip(),
            prev_college_name  = data.get('prev_college_name', '').strip(),
            prev_college_place = data.get('prev_college_place', '').strip(),
            year_of_passing    = data.get('year_of_passing', '').strip(),
            razorpay_order_id  = order['id'],
            payment_status     = 'pending',
        )

        return JsonResponse({
            'order_id': order['id'],
            'amount':   50000,
            'currency': 'INR',
            'key':      settings.RAZORPAY_KEY_ID,
            'app_id':   app.id,
            'name':     app.name,
            'email':    app.email,
            'phone':    app.phone,
        })

    except Exception as e:
        import traceback
        return JsonResponse({'error': str(e), 'detail': traceback.format_exc()}, status=400)


# ── Verify Payment + Send Email with PDF ─────────────────────────
@csrf_exempt
def verify_payment(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)

        razorpay_order_id   = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature  = data.get('razorpay_signature')

        # Verify signature
        msg = f"{razorpay_order_id}|{razorpay_payment_id}"
        generated = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            msg.encode(),
            hashlib.sha256
        ).hexdigest()

        if generated != razorpay_signature:
            return JsonResponse({'error': 'Invalid payment signature'}, status=400)

        # Update application
        app = AdmissionApplication.objects.get(razorpay_order_id=razorpay_order_id)
        app.razorpay_payment_id = razorpay_payment_id
        app.razorpay_signature  = razorpay_signature
        app.payment_status      = 'paid'
        app.save()

        # ── Generate PDF Receipt ──────────────────────────────
        try:
            pdf_buffer = generate_receipt_pdf(app)
            pdf_bytes  = pdf_buffer.read()
        except Exception as pdf_err:
            pdf_bytes = None
            print(f"PDF generation error: {pdf_err}")

        # ── Send HTML Email with PDF Attached ────────────────
        try:
            email = EmailMessage(
                subject = f'Admission Confirmed — Application #{app.id} | University Arts & Science College',
                body    = get_confirmation_email_html(app),
                from_email = settings.DEFAULT_FROM_EMAIL,
                to = [app.email],
            )
            email.content_subtype = 'html'  # Send as HTML

            # Attach PDF receipt
            if pdf_bytes:
                email.attach(
                    filename     = f'Admission_Receipt_{app.id}.pdf',
                    content      = pdf_bytes,
                    mimetype     = 'application/pdf',
                )

            email.send(fail_silently=True)

        except Exception as email_err:
            print(f"Email send error: {email_err}")
            # Don't fail the payment if email fails

        return JsonResponse({
            'success':    True,
            'app_id':     app.id,
            'name':       app.name,
            'course':     app.course,
            'payment_id': razorpay_payment_id,
        })

    except AdmissionApplication.DoesNotExist:
        return JsonResponse({'error': 'Application not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# ── Download Receipt PDF (Admin) ──────────────────────────────────
@csrf_exempt
def download_receipt(request, pk):
    """Admin endpoint — download PDF receipt for any application."""
    try:
        app = AdmissionApplication.objects.get(pk=pk)
        pdf_buffer = generate_receipt_pdf(app)

        filename = f'Admission_Receipt_{app.id}_{app.name.replace(" ", "_")}.pdf'

        response = HttpResponse(pdf_buffer.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    except AdmissionApplication.DoesNotExist:
        return JsonResponse({'error': 'Application not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# ── Admin: List Applications ──────────────────────────────────────
@csrf_exempt
def admission_list(request):
    qs     = AdmissionApplication.objects.all()
    page   = int(request.GET.get('page', 1))
    status = request.GET.get('status', '')
    course = request.GET.get('course', '')

    if status:
        qs = qs.filter(payment_status=status)
    if course:
        qs = qs.filter(course=course)

    paginator = Paginator(qs, 10)
    page_obj  = paginator.get_page(page)

    apps = []
    for a in page_obj.object_list:
        apps.append({
            'id':                  a.id,
            'name':                a.name,
            'email':               a.email,
            'phone':               a.phone,
            'course':              a.course,
            'gender':              a.gender,
            'date_of_birth':       str(a.date_of_birth) if a.date_of_birth else '',
            'address':             a.address,
            'father_name':         a.father_name,
            'father_phone':        a.father_phone,
            'mother_name':         a.mother_name,
            'mother_phone':        a.mother_phone,
            'prev_qualification':  a.prev_qualification,
            'prev_course_name':    a.prev_course_name,
            'prev_college_name':   a.prev_college_name,
            'prev_college_place':  a.prev_college_place,
            'year_of_passing':     a.year_of_passing,
            'amount':              str(a.amount),
            'payment_status':      a.payment_status,
            'razorpay_payment_id': a.razorpay_payment_id or '',
            'created_at':          a.created_at.strftime('%d %b %Y, %I:%M %p') if a.created_at else '',
        })

    return JsonResponse({
        'applications': apps,
        'page':         page_obj.number,
        'total_pages':  paginator.num_pages,
        'total':        paginator.count,
        'per_page':     10,
        'has_next':     page_obj.has_next(),
        'has_prev':     page_obj.has_previous(),
    })


# ── Admin: Delete Application ─────────────────────────────────────
@csrf_exempt
def admission_delete(request, pk):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        app = AdmissionApplication.objects.get(pk=pk)
        app.delete()
        return JsonResponse({'success': True})
    except AdmissionApplication.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)