import { useState } from 'react'
import AdmissionModal from './AdmissionModal'

export default function Admission() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section id="admission" style={{
        background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy2) 50%,var(--navy3) 100%)',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(204,0,0,.08)', top:-100, right:-100, filter:'blur(60px)', pointerEvents:'none' }}></div>
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(245,166,35,.06)', bottom:-80, left:-80, filter:'blur(60px)', pointerEvents:'none' }}></div>

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="row align-items-center g-4">

            {/* Left — Text */}
            <div className="col-lg-7">
              <div className="sec-badge gold">Admissions Open 2026</div>
              <h2 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:'clamp(1.8rem,4vw,2.6rem)',
                fontWeight:800, color:'#fff',
                lineHeight:1.2, margin:'12px 0 16px',
              }}>
                Begin Your Journey at <br />
                <span style={{ color:'var(--gold)' }}>University College</span>
              </h2>
              <p style={{ color:'rgba(255,255,255,.75)', fontSize:15, lineHeight:1.8, marginBottom:24, fontFamily:"'Inter',sans-serif", maxWidth:520 }}>
                Apply now for the 2026-27 academic year. Secure your seat in one of our 30+ programs across Science, Computer Science, and Commerce.
              </p>

              {/* Feature points */}
              <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
                {[
                  { icon:'bi-check-circle-fill', color:'#10b981', text:'Online application — apply from anywhere' },
                  { icon:'bi-check-circle-fill', color:'#10b981', text:'Secure payment via Razorpay — UPI, Cards, NetBanking' },
                  { icon:'bi-check-circle-fill', color:'#10b981', text:'Instant confirmation email after payment' },
                  { icon:'bi-check-circle-fill', color:'#10b981', text:'Application fee: ₹500 only' },
                ].map((f, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <i className={`bi ${f.icon}`} style={{ color:f.color, fontSize:'1rem', flexShrink:0 }}></i>
                    <span style={{ color:'rgba(255,255,255,.8)', fontSize:13, fontFamily:"'Inter',sans-serif", fontWeight:500 }}>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setOpen(true)}
                style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  background:'var(--gold)', color:'var(--navy)',
                  border:'none', borderRadius:30, padding:'15px 36px',
                  fontSize:15, fontFamily:"'Inter',sans-serif", fontWeight:800,
                  cursor:'pointer', boxShadow:'0 8px 24px rgba(245,166,35,.4)',
                  transition:'all .3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(245,166,35,.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(245,166,35,.4)' }}
              >
                <i className="bi bi-mortarboard-fill"></i>
                Apply Now — ₹500
              </button>

              <div style={{ marginTop:12, fontSize:12, color:'rgba(255,255,255,.45)', fontFamily:"'Inter',sans-serif" }}>
                <i className="bi bi-shield-lock-fill me-1" style={{ color:'var(--gold)' }}></i>
                Secure & encrypted payment
              </div>
            </div>

            {/* Right — Info Card */}
            <div className="col-lg-5">
              <div style={{
                background:'rgba(255,255,255,.06)',
                border:'1px solid rgba(255,255,255,.12)',
                borderRadius:24, padding:28,
                backdropFilter:'blur(12px)',
              }}>
                <div style={{ fontSize:13, fontWeight:800, color:'var(--gold)', textTransform:'uppercase', letterSpacing:1, marginBottom:18, fontFamily:"'Inter',sans-serif" }}>
                  Admission Details
                </div>

                {[
                  { icon:'bi-calendar-check-fill', label:'Academic Year', value:'2026 — 2027' },
                  { icon:'bi-cash-coin',            label:'Application Fee', value:'₹500 (one-time)' },
                  { icon:'bi-book-fill',            label:'Programs Available', value:'30+ UG Programs' },
                  { icon:'bi-clock-fill',           label:'Application Deadline', value:'Open Now' },
                  { icon:'bi-geo-alt-fill',         label:'Campus',        value:'Palakkad, Kerala' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display:'flex', alignItems:'center', gap:14,
                    padding:'12px 0',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,.07)' : 'none',
                  }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:'rgba(245,166,35,.15)', border:'1px solid rgba(245,166,35,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <i className={`bi ${item.icon}`} style={{ color:'var(--gold)', fontSize:'.95rem' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,.45)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5, fontFamily:"'Inter',sans-serif" }}>{item.label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginTop:1, fontFamily:"'Inter',sans-serif" }}>{item.value}</div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setOpen(true)}
                  style={{
                    width:'100%', marginTop:20, padding:'13px',
                    borderRadius:14, background:'var(--red)',
                    color:'#fff', border:'none', fontWeight:700,
                    fontSize:14, cursor:'pointer',
                    fontFamily:"'Inter',sans-serif",
                    boxShadow:'0 4px 16px rgba(204,0,0,.35)',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  }}
                >
                  <i className="bi bi-send-fill"></i> Start Application
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Admission Modal */}
      {open && <AdmissionModal onClose={() => setOpen(false)} />}
    </>
  )
}