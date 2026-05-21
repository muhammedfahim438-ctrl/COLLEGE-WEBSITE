import { useState } from 'react'

function Hero({ onApplyClick }) {
  const [cardOpen, setCardOpen] = useState(false)

  const scrollToAdmission = () => {
    setCardOpen(false)
    setTimeout(() => {
      const el = document.getElementById('admission')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  const actions = [
    {
      icon: 'bi-pencil-square',
      title: 'Apply for Admission',
      desc: 'Start your 2026 application — ₹500 fee',
      bg: 'linear-gradient(135deg,var(--red),#e63946)',
      shadow: 'rgba(204,0,0,.35)',
      onClick: scrollToAdmission,
    },
    {
      icon: 'bi-book-fill',
      title: 'Explore Courses',
      desc: '30+ programs in Science, Computer & Commerce',
      bg: 'linear-gradient(135deg,var(--navy),#004080)',
      shadow: 'rgba(0,51,102,.3)',
      onClick: () => { setCardOpen(false); document.getElementById('courses')?.scrollIntoView({ behavior:'smooth' }) },
    },
    {
      icon: 'bi-telephone-fill',
      title: 'Call Admissions Office',
      desc: 'Mon–Sat 9AM–5PM · 0491 2527770',
      bg: 'linear-gradient(135deg,#059669,#10b981)',
      shadow: 'rgba(5,150,105,.3)',
      onClick: () => { window.location.href = 'tel:04912527770' },
    },
    {
      icon: 'bi-envelope-fill',
      title: 'Email Us',
      desc: 'universitycollegepkd@university.com',
      bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
      shadow: 'rgba(124,58,237,.3)',
      onClick: () => { window.location.href = 'mailto:universitycollegepkd@university.com' },
    },
  ]

  return (
    <section id="hero-info" className="hero">
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div className="row align-items-center g-4">

          {/* ── Left Column ── */}
          <div className="col-lg-6">
            <div className="hero-badge fu">
              <i className="bi bi-patch-check-fill"></i> Est. 2011 — Premier Institution
            </div>
            <h1 className="fu d1">
              University Arts &amp;<br />
              <span>Science College</span>
            </h1>
            <p className="fu d2">
              A premier institution in Palakkad, Kerala dedicated to academic excellence,
              innovation, and holistic student development — offering programs in arts,
              science, and commerce.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 mt-4 fu d3">
              <button
                onClick={scrollToAdmission}
                className="btn-red"
                style={{ border:'none', cursor:'pointer' }}
              >
                <i className="bi bi-pencil-square"></i> Apply for Admission
              </button>
              <a href="#courses" className="btn-blue"
                style={{ background:'linear-gradient(135deg,var(--navy),#004080)',
                  display:'inline-flex', alignItems:'center', gap:8,
                  borderRadius:30, padding:'13px 28px', color:'#fff',
                  textDecoration:'none', fontWeight:700, fontSize:14,
                  fontFamily:"'Inter',sans-serif" }}
              >
                <i className="bi bi-book-fill"></i> Explore Courses
              </a>
            </div>

            {/* Admissions Open banner */}
            <div className="fu d3" style={{
              marginTop:20,
              background:'linear-gradient(135deg,rgba(204,0,0,.08),rgba(245,166,35,.08))',
              border:'1.5px solid rgba(204,0,0,.2)',
              borderRadius:12, padding:'10px 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              flexWrap:'wrap', gap:8,
            }}>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--red)' }}>
                <i className="bi bi-megaphone-fill me-2"></i>
                Admissions 2026 are now open!
              </span>
              <button
                onClick={scrollToAdmission}
                style={{ background:'var(--red)', border:'none', borderRadius:20,
                  color:'#fff', fontSize:12, fontWeight:700,
                  padding:'5px 16px', cursor:'pointer' }}
              >
                Apply Now →
              </button>
            </div>

            {/* Stats Bar */}
            <div className="hero-stats fu d4">
              {[
                { num:'14+', lbl:'Years' },
                { num:'5K+', lbl:'Alumni' },
                { num:'30+', lbl:'Courses' },
                { num:'95%', lbl:'Placement' },
              ].map(s => (
                <div className="hs-item" key={s.lbl}>
                  <div className="hs-num">{s.num}</div>
                  <div className="hs-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column — Beautiful Action Card ── */}
          <div className="col-lg-6 fu d3">

            {/* Closed state — teaser card */}
            {!cardOpen && (
              <div
                onClick={() => setCardOpen(true)}
                style={{
                  background:'#fff',
                  border:'1.5px solid #e8e8e8',
                  borderRadius:24,
                  padding:'28px 24px',
                  boxShadow:'0 12px 40px rgba(0,51,102,.12)',
                  cursor:'pointer',
                  transition:'all .3s',
                  position:'relative',
                  overflow:'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 56px rgba(0,51,102,.18)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,51,102,.12)' }}
              >
                {/* Decorative blobs */}
                <div style={{ position:'absolute', width:160, height:160, borderRadius:'50%', background:'rgba(204,0,0,.05)', top:-40, right:-40, pointerEvents:'none' }} />
                <div style={{ position:'absolute', width:100, height:100, borderRadius:'50%', background:'rgba(245,166,35,.07)', bottom:-20, left:-20, pointerEvents:'none' }} />

                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,var(--navy),#004080)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0, boxShadow:'0 6px 16px rgba(0,51,102,.25)' }}>🎓</div>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, color:'var(--navy)', fontSize:'1rem', lineHeight:1.2 }}>
                      College At a Glance — 2026
                    </div>
                    <div style={{ fontSize:11, color:'#888', fontFamily:"'Inter',sans-serif", marginTop:3 }}>
                      Tap to explore options
                    </div>
                  </div>
                  <div style={{ marginLeft:'auto', width:36, height:36, borderRadius:10, background:'rgba(0,51,102,.06)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy)', fontSize:'1.1rem' }}>
                    <i className="bi bi-grid-fill"></i>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
                  {[
                    { ico:'bi-people-fill',      color:'rgba(0,51,102,.12)',    ic:'var(--navy)',  num:'2,500+', lbl:'Students Enrolled' },
                    { ico:'bi-person-workspace', color:'rgba(16,185,129,.12)', ic:'#059669',      num:'120+',   lbl:'Expert Faculty' },
                    { ico:'bi-trophy-fill',       color:'rgba(245,166,35,.15)', ic:'#b87a00',     num:'30+',    lbl:'Awards Won' },
                    { ico:'bi-building',          color:'rgba(204,0,0,.08)',    ic:'var(--red)',   num:'10 Acres', lbl:'Green Campus' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background:'#f8fafc', border:'1.5px solid #e8ecf4',
                      borderRadius:14, padding:'14px 12px',
                      display:'flex', alignItems:'center', gap:10,
                    }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:item.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <i className={`bi ${item.ico}`} style={{ color:item.ic, fontSize:'.95rem' }}></i>
                      </div>
                      <div>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', fontWeight:800, color:'var(--navy)', lineHeight:1 }}>{item.num}</div>
                        <div style={{ fontSize:9.5, fontFamily:"'Inter',sans-serif", color:'#666', fontWeight:600, textTransform:'uppercase', letterSpacing:.3, marginTop:2 }}>{item.lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
                  {[
                    { icon:'bi-shield-check', label:'NAAC Accredited', bg:'rgba(0,51,102,.08)', color:'var(--navy)' },
                    { icon:'bi-star-fill',    label:'ISO Certified',   bg:'rgba(245,166,35,.12)', color:'#b87a00' },
                    { icon:'bi-patch-check-fill', label:'Est. 2011',   bg:'rgba(16,185,129,.1)',  color:'#059669' },
                  ].map(t => (
                    <span key={t.label} style={{ display:'inline-flex', alignItems:'center', gap:5, background:t.bg, color:t.color, border:`1px solid ${t.bg}`, borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:700, fontFamily:"'Inter',sans-serif" }}>
                      <i className={`bi ${t.icon}`}></i> {t.label}
                    </span>
                  ))}
                </div>

                {/* Click-to-open CTA */}
                <div style={{
                  background:'linear-gradient(135deg,var(--navy),#004080)',
                  borderRadius:14, padding:'14px 16px',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                }}>
                  <span style={{ color:'#fff', fontWeight:700, fontSize:14, fontFamily:"'Inter',sans-serif" }}>
                    <i className="bi bi-lightning-charge-fill me-2" style={{ color:'var(--gold)' }}></i>
                    Quick Actions
                  </span>
                  <span style={{ background:'rgba(255,255,255,.15)', borderRadius:20, padding:'4px 14px', color:'#fff', fontSize:12, fontWeight:700, fontFamily:"'Inter',sans-serif", display:'flex', alignItems:'center', gap:6 }}>
                    Open <i className="bi bi-chevron-right" style={{ fontSize:10 }}></i>
                  </span>
                </div>
              </div>
            )}

            {/* Opened state — Action buttons panel */}
            {cardOpen && (
              <div style={{
                background:'#fff',
                border:'1.5px solid #e8e8e8',
                borderRadius:24,
                overflow:'hidden',
                boxShadow:'0 20px 56px rgba(0,51,102,.18)',
                animation:'scaleIn .25s ease forwards',
              }}>
                {/* Panel header */}
                <div style={{
                  background:'linear-gradient(135deg,var(--navy),#004080)',
                  padding:'20px 22px',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                }}>
                  <div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, fontFamily:"'Inter',sans-serif", marginBottom:3 }}>
                      University College
                    </div>
                    <div style={{ fontFamily:"'Playfair Display',serif", color:'#fff', fontWeight:800, fontSize:'1.05rem' }}>
                      What would you like to do?
                    </div>
                  </div>
                  <button
                    onClick={() => setCardOpen(false)}
                    style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {/* Action buttons */}
                <div style={{ padding:'16px' }}>
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={action.onClick}
                      style={{
                        width:'100%', marginBottom: i < actions.length - 1 ? 10 : 0,
                        padding:'16px 18px', border:'none', borderRadius:16,
                        background:'#f8fafc', cursor:'pointer', textAlign:'left',
                        display:'flex', alignItems:'center', gap:14,
                        transition:'all .2s', fontFamily:"'Inter',sans-serif",
                        border:'1.5px solid #e8ecf4',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = action.bg
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.transform = 'translateX(4px)'
                        e.currentTarget.style.boxShadow = `0 6px 20px ${action.shadow}`
                        e.currentTarget.querySelectorAll('[data-text]').forEach(el => el.style.color = '#fff')
                        e.currentTarget.querySelector('[data-icon]').style.background = 'rgba(255,255,255,.2)'
                        e.currentTarget.querySelector('[data-icon]').style.color = '#fff'
                        e.currentTarget.querySelector('[data-arrow]').style.opacity = '1'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.borderColor = '#e8ecf4'
                        e.currentTarget.style.transform = 'translateX(0)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.querySelectorAll('[data-text]').forEach(el => el.style.color = '')
                        e.currentTarget.querySelector('[data-icon]').style.background = ''
                        e.currentTarget.querySelector('[data-icon]').style.color = ''
                        e.currentTarget.querySelector('[data-arrow]').style.opacity = '0'
                      }}
                    >
                      {/* Icon */}
                      <div data-icon style={{
                        width:46, height:46, borderRadius:14,
                        background: action.bg,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'1.2rem', color:'#fff', flexShrink:0,
                        boxShadow:`0 4px 12px ${action.shadow}`,
                        transition:'all .2s',
                      }}>
                        <i className={`bi ${action.icon}`}></i>
                      </div>

                      {/* Text */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div data-text style={{ fontWeight:800, fontSize:14, color:'var(--navy)', lineHeight:1.2, transition:'color .2s' }}>
                          {action.title}
                        </div>
                        <div data-text style={{ fontSize:11.5, color:'#888', marginTop:3, fontWeight:500, transition:'color .2s', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {action.desc}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div data-arrow style={{ opacity:0, transition:'opacity .2s', color:'#fff', fontSize:'1rem', flexShrink:0 }}>
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer note */}
                <div style={{ padding:'12px 20px 18px', borderTop:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                  <span style={{ fontSize:11, color:'#94a3b8', fontFamily:"'Inter',sans-serif" }}>
                    <i className="bi bi-shield-check-fill me-1" style={{ color:'#10b981' }}></i>
                    NAAC Accredited · ISO Certified · Est. 2011
                  </span>
                  <button onClick={() => setCardOpen(false)} style={{ background:'none', border:'none', fontSize:11, color:'#94a3b8', cursor:'pointer', fontFamily:"'Inter',sans-serif", fontWeight:600 }}>
                    ← Back
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero