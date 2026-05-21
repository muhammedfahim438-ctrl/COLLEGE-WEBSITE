from django.db import models


class AdmissionApplication(models.Model):

    GENDER_CHOICES = [
        ('Male',   'Male'),
        ('Female', 'Female'),
        ('Other',  'Other'),
    ]

    QUALIFICATION_CHOICES = [
        ('10th',    '10th'),
        ('12th',    '12th'),
        ('Diploma', 'Diploma'),
        ('Degree',  'Degree'),
    ]

    PAYMENT_CHOICES = [
        ('pending', 'Pending'),
        ('paid',    'Paid'),
        ('failed',  'Failed'),
    ]

    # ── Personal Info ──
    name          = models.CharField(max_length=200)
    email         = models.EmailField()
    phone         = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender        = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address       = models.TextField()

    # ── Parents Details ──
    father_name   = models.CharField(max_length=200)
    father_phone  = models.CharField(max_length=20)
    mother_name   = models.CharField(max_length=200)
    mother_phone  = models.CharField(max_length=20)

    # ── Academic Info ──
    course             = models.CharField(max_length=200)
    prev_qualification = models.CharField(max_length=20, choices=QUALIFICATION_CHOICES)
    prev_course_name   = models.CharField(max_length=200)
    prev_college_name  = models.CharField(max_length=200)
    prev_college_place = models.CharField(max_length=200)
    year_of_passing    = models.CharField(max_length=10)

    # ── Payment ──
    amount              = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    payment_status      = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='pending')
    razorpay_order_id   = models.CharField(max_length=200, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=200, blank=True, null=True)
    razorpay_signature  = models.CharField(max_length=500, blank=True, null=True)

    # ── Meta ──
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.course} ({self.payment_status})"

    class Meta:
        ordering = ['-created_at']