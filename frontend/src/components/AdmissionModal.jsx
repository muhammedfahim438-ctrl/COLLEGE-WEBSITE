import { useState } from 'react'

const COURSE_GROUPS = [
  {
    group: '🔬 Science',
    courses: ['BSc Physics','BSc Chemistry','BSc Zoology','BSc Botany','BSc Mathematics','BSc Microbiology','BSc Electronics','BSc Statistics'],
  },
  {
    group: '💻 Computer',
    courses: ['BCA','BSc Computer Science','BSc AI & ML','BSc IT','BSc Data Science','BSc Cyber Security','BSc IoT','BSc Cloud Computing'],
  },
  {
    group: '📊 Commerce',
    courses: ['BCom Finance','BCom Banking','BCom Marketing','BCom Taxation','BCom HR','BCom E-Commerce','BCom Business Analytics','BCom Accounting'],
  },
]

const empty = {
  name:'', email:'', phone:'', date_of_birth:'', gender:'', address:'',
  father_name:'', father_phone:'', mother_name:'', mother_phone:'',
  course:'', prev_qualification:'', prev_course_name:'',
  prev_college_name:'', prev_college_place:'', year_of_passing:'',
}

const steps = ['Personal Info', 'Parents Details', 'Academic Info', 'Payment']

// ── Qualification logic ───────────────────────────────────────────
// 10th / 12th  → school level → NO college details needed
// Diploma / Degree → college level → SHOW college details
const needsCollegeDetails = (qual) => qual === 'Diploma' || qual === 'Degree'

export default function AdmissionModal({ onClose }) {
  const [step, setStep]       = useState(0)
  const [form, setForm]       = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(null)

  const handleChange = e => {
    const updated = { ...form, [e.target.name]: e.target.value }
    // When qualification changes, clear college fields to avoid stale data
    if (e.target.name === 'prev_qualification') {
      updated.prev_course_name   = ''
      updated.prev_college_name  = ''
      updated.prev_college_place = ''
      updated.year_of_passing    = ''
    }
    setForm(updated)
  }

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    if (step === 0) {
      if (!form.name.trim())         return 'Please enter your full name.'
      if (!form.email.trim())        return 'Please enter your email.'
      if (!form.phone.trim())        return 'Please enter your phone number.'
      if (!form.date_of_birth)       return 'Please select your date of birth.'
      if (!form.gender)              return 'Please select your gender.'
      if (!form.address.trim())      return 'Please enter your address.'

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email.trim()))
        return 'Please enter a valid email address (e.g. name@example.com).'

      // Phone validation — exactly 10 digits
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(form.phone.trim()))
        return 'Phone number must be 10 digits and start with 6, 7, 8, or 9.'

      // Date of birth validation
      const dob = new Date(form.date_of_birth)
      const today = new Date()
      const dobYear = dob.getFullYear()
      if (isNaN(dob.getTime()))
        return 'Please enter a valid date of birth.'
      if (dobYear < 1950 || dobYear > today.getFullYear())
        return `Date of birth year must be between 1950 and ${today.getFullYear()}.`
      if (dob >= today)
        return 'Date of birth must be in the past.'
      const age = today.getFullYear() - dobYear
      if (age < 15)
        return 'Applicant must be at least 15 years old.'
    }

    if (step === 1) {
      if (!form.father_name.trim())  return 'Please enter father\'s name.'
      if (!form.father_phone.trim()) return 'Please enter father\'s phone number.'
      if (!form.mother_name.trim())  return 'Please enter mother\'s name.'
      if (!form.mother_phone.trim()) return 'Please enter mother\'s phone number.'

      // Parent phone validations
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(form.father_phone.trim()))
        return 'Father\'s phone must be 10 digits and start with 6, 7, 8, or 9.'
      if (!phoneRegex.test(form.mother_phone.trim()))
        return 'Mother\'s phone must be 10 digits and start with 6, 7, 8, or 9.'
    }

    if (step === 2) {
      if (!form.course)               return 'Please select a course.'
      if (!form.prev_qualification)   return 'Please select your previous qualification.'
      if (!form.year_of_passing.trim()) return 'Please enter your year of passing.'

      // Year of passing validation
      const year = parseInt(form.year_of_passing)
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear())
        return `Year of passing must be between 1990 and ${new Date().getFullYear()}.`

      // College details only required if Diploma or Degree
      if (needsCollegeDetails(form.prev_qualification)) {
        if (!form.prev_course_name.trim())   return 'Please enter your previous course name.'
        if (!form.prev_college_name.trim())  return 'Please enter your previous college name.'
        if (!form.prev_college_place.trim()) return 'Please enter your previous college place.'
      }
    }

    return ''
  }

  const next = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  const prev = () => { setError(''); setStep(s => s - 1) }

  // Load Razorpay script
  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload  = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })

  // Pay handler
  const handlePay = async () => {
    setLoading(true)
    setError('')
    try {
      const loaded = await loadRazorpay()
      if (!loaded) { setError('Failed to load payment gateway. Please try again.'); setLoading(false); return }

      const res  = await fetch('/admissions/create-order/', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error||'Failed to create order.'); setLoading(false); return }

      const options = {
        key:         data.key,
        amount:      data.amount,
        currency:    data.currency,
        name:        'University Arts & Science College',
        description: `Admission Fee — ${form.course}`,
        order_id:    data.order_id,
        prefill: { name:data.name, email:data.email, contact:data.phone },
        theme: { color:'#6366f1' },
        handler: async function(response) {
          const vRes = await fetch('/admissions/verify-payment/', {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          })
          const vData = await vRes.json()
          if (vRes.ok && vData.success) {
            setSuccess(vData)
            setStep(4)
          } else {
            setError(vData.error || 'Payment verification failed.')
          }
          setLoading(false)
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. Please try again.')
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (e) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // ── Derived state ─────────────────────────────────────────────────
  const showCollegeFields = needsCollegeDetails(form.prev_qualification)

  // Label for prev_course_name changes based on qualification
  const prevCourseLabel = form.prev_qualification === 'Degree'
    ? 'Degree Course Name'
    : form.prev_qualification === 'Diploma'
    ? 'Diploma Course Name'
    : 'Previous Course Name'

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(10,22,40,.85)', zIndex:9990, backdropFilter:'blur(8px)' }} />

      {/* Modal */}
      <div style={{
        position:'fixed', inset:0, zIndex:9991,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'16px', overflowY:'auto',
      }}>
        <div style={{
          background:'#fff', borderRadius:24, width:'100%', maxWidth:560,
          boxShadow:'0 32px 80px rgba(0,0,0,.25)',
          maxHeight:'95vh', overflowY:'auto',
          margin:'auto',
        }}>
          {/* Header */}
          <div style={{
            background:'linear-gradient(135deg,var(--navy),var(--navy2))',
            padding:'24px 24px 20px', borderRadius:'24px 24px 0 0',
            position:'sticky', top:0, zIndex:10,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>
                  University Arts & Science College
                </div>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', fontFamily:"'Playfair Display',serif" }}>
                  Admission Application 2026
                </div>
              </div>
              <button onClick={onClose} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:10, width:36, height:36, color:'#fff', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {step < 4 && (
              <div style={{ display:'flex', gap:6, marginTop:16 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ flex:1 }}>
                    <div style={{
                      height:4, borderRadius:4,
                      background: i <= step ? 'var(--gold)' : 'rgba(255,255,255,.2)',
                      transition:'background .3s',
                    }} />
                    <div style={{ fontSize:9, color: i <= step ? 'var(--gold)' : 'rgba(255,255,255,.4)', marginTop:4, fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ padding:'24px' }}>

            {/* Error */}
            {error && (
              <div style={{ background:'#fff5f5', border:'1.5px solid #fed7d7', borderRadius:12, padding:'10px 14px', marginBottom:16, color:'#c53030', fontSize:13, fontWeight:600 }}>
                <i className="bi bi-exclamation-circle me-2"></i>{error}
              </div>
            )}

            {/* ── STEP 0: Personal Info ── */}
            {step === 0 && (
              <>
                <SectionTitle icon="bi-person-fill" title="Personal Information" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="Full Name" name="name" placeholder="Enter your full name" form={form} onChange={handleChange} />
                  </div>
                  <Field label="Email" name="email" type="email" placeholder="your@email.com" form={form} onChange={handleChange} />
                  <Field label="Phone" name="phone" type="tel" placeholder="10-digit mobile number" form={form} onChange={handleChange} />
                  <Field label="Date of Birth" name="date_of_birth" type="date" max={new Date().toISOString().split("T")[0]} min="1950-01-01" form={form} onChange={handleChange} />
                  <Field label="Gender" name="gender" options={['Male','Female','Other']} form={form} onChange={handleChange} />
                  <div style={{ gridColumn:'1/-1' }}>
                    <div style={{ marginBottom:14 }}>
                      <label style={lbl}>Address <span style={{ color:'#e53e3e' }}>*</span></label>
                      <textarea name="address" value={form.address} onChange={handleChange}
                        placeholder="Enter your full address" rows={3}
                        style={{ ...inp, resize:'vertical', minHeight:80 }} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 1: Parents Details ── */}
            {step === 1 && (
              <>
                <SectionTitle icon="bi-people-fill" title="Parents Details" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <div style={{ background:'rgba(99,102,241,.06)', borderRadius:12, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#6366f1', fontWeight:600 }}>
                      <i className="bi bi-person-fill me-2"></i>Father's Details
                    </div>
                  </div>
                  <Field label="Father's Name" name="father_name" placeholder="Enter father's name" form={form} onChange={handleChange} />
                  <Field label="Father's Phone" name="father_phone" type="tel" placeholder="10-digit number" form={form} onChange={handleChange} />
                  <div style={{ gridColumn:'1/-1' }}>
                    <div style={{ background:'rgba(236,72,153,.06)', borderRadius:12, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#db2777', fontWeight:600 }}>
                      <i className="bi bi-person-fill me-2"></i>Mother's Details
                    </div>
                  </div>
                  <Field label="Mother's Name" name="mother_name" placeholder="Enter mother's name" form={form} onChange={handleChange} />
                  <Field label="Mother's Phone" name="mother_phone" type="tel" placeholder="10-digit number" form={form} onChange={handleChange} />
                </div>
              </>
            )}

            {/* ── STEP 2: Academic Info ── */}
            {step === 2 && (
              <>
                <SectionTitle icon="bi-mortarboard-fill" title="Academic Information" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>

                  {/* Course */}
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="Course Applying For" name="course" options={COURSE_GROUPS} form={form} onChange={handleChange} />
                  </div>

                  {/* Qualification */}
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="Previous Qualification" name="prev_qualification"
                      options={['10th','12th','Diploma','Degree']} form={form} onChange={handleChange} />
                  </div>

                  {/* ── Info banner — changes based on qualification ── */}
                  {form.prev_qualification && (
                    <div style={{ gridColumn:'1/-1' }}>
                      {!showCollegeFields ? (
                        <div style={{ background:'rgba(16,185,129,.08)', border:'1.5px solid rgba(16,185,129,.2)', borderRadius:12, padding:'10px 14px', fontSize:12, color:'#065f46', fontWeight:600 }}>
                          <i className="bi bi-info-circle-fill me-2"></i>
                          You selected <strong>{form.prev_qualification}</strong> — only year of passing is needed. No previous college details required.
                        </div>
                      ) : (
                        <div style={{ background:'rgba(99,102,241,.06)', border:'1.5px solid rgba(99,102,241,.2)', borderRadius:12, padding:'10px 14px', fontSize:12, color:'#3730a3', fontWeight:600 }}>
                          <i className="bi bi-info-circle-fill me-2"></i>
                          You selected <strong>{form.prev_qualification}</strong> — please fill in your previous college details below.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Year of passing — always shown */}
                  <div style={{ gridColumn: showCollegeFields ? 'auto' : '1/-1' }}>
                    <Field label="Year of Passing" name="year_of_passing" placeholder="e.g. 2024" form={form} onChange={handleChange} />
                  </div>

                  {/* ── College details — only for Diploma / Degree ── */}
                  {showCollegeFields && (
                    <>
                      <Field label={prevCourseLabel} name="prev_course_name" placeholder="e.g. BSc Computer Science" form={form} onChange={handleChange} />
                      <Field label="Previous College Name" name="prev_college_name" placeholder="College name" form={form} onChange={handleChange} />
                      <Field label="Previous College Place" name="prev_college_place" placeholder="City / Town" form={form} onChange={handleChange} />
                    </>
                  )}

                </div>
              </>
            )}

            {/* ── STEP 3: Payment ── */}
            {step === 3 && (
              <>
                <SectionTitle icon="bi-credit-card-fill" title="Payment Summary" />

                <div style={{ background:'linear-gradient(135deg,var(--navy),var(--navy2))', borderRadius:16, padding:20, marginBottom:20, color:'#fff' }}>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', marginBottom:4 }}>Applicant</div>
                  <div style={{ fontSize:16, fontWeight:800, marginBottom:12 }}>{form.name}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { l:'Course',        v:form.course },
                      { l:'Qualification', v:form.prev_qualification },
                      { l:'Email',         v:form.email },
                      { l:'Phone',         v:form.phone },
                    ].map(i => (
                      <div key={i.l} style={{ background:'rgba(255,255,255,.08)', borderRadius:10, padding:'8px 10px' }}>
                        <div style={{ fontSize:9, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:.5, marginBottom:2 }}>{i.l}</div>
                        <div style={{ fontSize:12, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{i.v||'—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background:'#f8fafc', border:'1.5px solid #e8ecf4', borderRadius:16, padding:20, marginBottom:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:'#64748b' }}>Admission Fee</span>
                    <span style={{ fontSize:22, fontWeight:800, color:'var(--navy)' }}>₹500</span>
                  </div>
                  <div style={{ fontSize:12, color:'#94a3b8', lineHeight:1.6 }}>
                    <i className="bi bi-shield-check-fill me-1" style={{ color:'#10b981' }}></i>
                    Secure payment powered by Razorpay
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
                    {['UPI','Cards','NetBanking','Wallets'].map(m => (
                      <span key={m} style={{ background:'#eef2ff', color:'#6366f1', borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:700 }}>{m}</span>
                    ))}
                  </div>
                </div>

                <button onClick={handlePay} disabled={loading} style={{
                  width:'100%', padding:'16px', borderRadius:14,
                  background:'linear-gradient(135deg,#6366f1,#a78bfa)',
                  color:'#fff', border:'none', fontWeight:800, fontSize:16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow:'0 6px 20px rgba(99,102,241,.35)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  fontFamily:"'Inter',sans-serif",
                }}>
                  {loading
                    ? <><i className="bi bi-hourglass-split"></i> Processing...</>
                    : <><i className="bi bi-lock-fill"></i> Pay ₹500 & Submit Application</>
                  }
                </button>
              </>
            )}

            {/* ── STEP 4: Success ── */}
            {step === 4 && success && (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{
                  width:80, height:80, borderRadius:'50%',
                  background:'linear-gradient(135deg,#10b981,#34d399)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 20px',
                  boxShadow:'0 8px 24px rgba(16,185,129,.35)',
                  fontSize:'2rem',
                }}>✓</div>

                <h3 style={{ fontFamily:"'Playfair Display',serif", color:'var(--navy)', fontSize:'1.5rem', marginBottom:8 }}>
                  Application Submitted!
                </h3>
                <p style={{ color:'#64748b', fontSize:14, lineHeight:1.7, marginBottom:20 }}>
                  Thank you <strong>{success.name}</strong>! Your admission application has been successfully submitted and payment confirmed.
                </p>

                <div style={{ background:'#f8fafc', border:'1.5px solid #e8ecf4', borderRadius:16, padding:20, marginBottom:20, textAlign:'left' }}>
                  {[
                    { l:'Application ID', v:`#${success.app_id}` },
                    { l:'Course',         v:success.course },
                    { l:'Amount Paid',    v:'₹500' },
                    { l:'Payment ID',     v:success.payment_id },
                  ].map(i => (
                    <div key={i.l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
                      <span style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>{i.l}</span>
                      <span style={{ fontSize:13, color:'var(--navy)', fontWeight:700 }}>{i.v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background:'rgba(16,185,129,.08)', border:'1.5px solid rgba(16,185,129,.2)', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#065f46', fontWeight:600 }}>
                  <i className="bi bi-envelope-check-fill me-2"></i>
                  Confirmation email sent to <strong>{form.email}</strong>
                </div>

                <button onClick={onClose} style={{
                  width:'100%', padding:14, borderRadius:12,
                  background:'linear-gradient(135deg,var(--navy),var(--navy2))',
                  color:'#fff', border:'none', fontWeight:700, fontSize:15,
                  cursor:'pointer', fontFamily:"'Inter',sans-serif",
                }}>
                  Close
                </button>
              </div>
            )}

            {/* Navigation buttons */}
            {step < 3 && (
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                {step > 0 && (
                  <button onClick={prev} style={{
                    flex:1, padding:13, borderRadius:12,
                    background:'#f8fafc', border:'1.5px solid #e8ecf4',
                    color:'#64748b', fontWeight:700, fontSize:14, cursor:'pointer',
                    fontFamily:"'Inter',sans-serif",
                  }}>
                    <i className="bi bi-arrow-left me-2"></i>Back
                  </button>
                )}
                <button onClick={next} style={{
                  flex:2, padding:13, borderRadius:12,
                  background:'linear-gradient(135deg,var(--navy),var(--navy2))',
                  color:'#fff', border:'none', fontWeight:700, fontSize:14,
                  cursor:'pointer', fontFamily:"'Inter',sans-serif",
                  boxShadow:'0 4px 12px rgba(0,51,102,.25)',
                }}>
                  Next <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

// ── Field component (outside AdmissionModal to prevent remount) ───
function Field({ label, name, type='text', placeholder='', options=null, required=true, form, onChange, min, max }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={lbl}>{label}{required && <span style={{ color:'#e53e3e' }}> *</span>}</label>
      {options ? (
        <select name={name} value={form[name]} onChange={onChange} style={inp}>
          <option value="">Select {label}</option>
          {options.map(o => (
            typeof o === 'string'
              ? <option key={o} value={o}>{o}</option>
              : <optgroup key={o.group} label={o.group}>
                  {o.courses.map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
          ))}
        </select>
      ) : (
        <input type={type} name={name} value={form[name]}
          onChange={onChange} placeholder={placeholder} style={inp}
          {...(min !== undefined && { min })} {...(max !== undefined && { max })} />
      )}
    </div>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18, paddingBottom:12, borderBottom:'1px solid #f1f5f9' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--navy),var(--navy2))', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold)', fontSize:'1rem' }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <span style={{ fontWeight:800, color:'var(--navy)', fontSize:15, fontFamily:"'Playfair Display',serif" }}>{title}</span>
    </div>
  )
}

const lbl = {
  display:'block', fontSize:11, fontWeight:700, color:'#64748b',
  textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5,
  fontFamily:"'Inter',sans-serif",
}

const inp = {
  width:'100%', padding:'11px 14px', border:'1.5px solid #e2e8f0',
  borderRadius:10, fontSize:16, color:'#1e1b4b', outline:'none',
  background:'#ffffff', boxSizing:'border-box', fontFamily:"'Inter',sans-serif",
  transition:'border .2s', WebkitAppearance:'none', appearance:'none',
}