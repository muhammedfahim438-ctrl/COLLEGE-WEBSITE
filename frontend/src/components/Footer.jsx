function Footer({ onApplyClick }) {
  return (
    <footer>
      <div className="container">
        <div className="row g-4">

          {/* ── Brand & Social ── */}
          <div className="col-12 col-lg-4">
            <div className="f-brand mb-3">🎓 University College</div>
            <p style={{ color:'rgba(255,255,255,.45)', fontSize:13, fontFamily:"'Lora',serif", lineHeight:1.85 }}>
              Dedicated to excellence in arts, science, and commerce education
              since 2011. Shaping futures, one student at a time — Palakkad, Kerala.
            </p>
            <div className="d-flex gap-2 mt-3 flex-wrap">
              <a href="#" className="soc-btn"><i className="bi bi-facebook"></i></a>
              <a href="#" className="soc-btn"><i className="bi bi-instagram"></i></a>
              <a href="#" className="soc-btn"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="soc-btn"><i className="bi bi-youtube"></i></a>
              <a href="#" className="soc-btn"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-6 col-lg-2">
            <p style={{ color:'rgba(255,255,255,.45)', fontSize:11, textTransform:'uppercase',
              letterSpacing:1, fontWeight:700, fontFamily:"'Lora',serif", marginBottom:12 }}>
              Quick Links
            </p>
            <div className="d-flex flex-column">
              {['home','about','courses','gallery','contact'].map(link => (
                <a key={link} href={`#${link}`} className="f-link">
                  <i className="bi bi-chevron-right"></i>
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </a>
              ))}
              {/* Admission link in quick links */}
              <button
                onClick={onApplyClick}
                className="f-link"
                style={{ background:'none', border:'none', padding:0, cursor:'pointer',
                  textAlign:'left', display:'flex', alignItems:'center', gap:4 }}
              >
                <i className="bi bi-chevron-right"></i> Admissions
              </button>
            </div>
          </div>

          {/* ── Courses ── */}
          <div className="col-6 col-lg-2">
            <p style={{ color:'rgba(255,255,255,.45)', fontSize:11, textTransform:'uppercase',
              letterSpacing:1, fontWeight:700, fontFamily:"'Lora',serif", marginBottom:12 }}>
              Courses
            </p>
            <div className="d-flex flex-column">
              {['Science','Computer','Commerce'].map(c => (
                <a key={c} href="#courses" className="f-link">
                  <i className="bi bi-chevron-right"></i> {c}
                </a>
              ))}
            </div>

            {/* Admission CTA box */}
            <div style={{ marginTop:24 }}>
              <p style={{ color:'rgba(255,255,255,.45)', fontSize:11, textTransform:'uppercase',
                letterSpacing:1, fontWeight:700, fontFamily:"'Lora',serif", marginBottom:12 }}>
                Admissions
              </p>
              <button
                onClick={onApplyClick}
                style={{
                  width:'100%', padding:'11px 14px', border:'none', borderRadius:10,
                  background:'linear-gradient(135deg,var(--red),#e63946)',
                  color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                  boxShadow:'0 4px 14px rgba(204,0,0,.35)',
                  fontFamily:"'Inter',sans-serif",
                  transition:'transform .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
              >
                <i className="bi bi-pencil-square"></i> Apply Now 2026
              </button>
              <p style={{ color:'rgba(255,255,255,.3)', fontSize:11, marginTop:8, marginBottom:0, lineHeight:1.6 }}>
                Seats filling fast — secure your spot today.
              </p>
            </div>
          </div>

          {/* ── Contact Info ── */}
          <div className="col-12 col-lg-4">
            <p style={{ color:'rgba(255,255,255,.45)', fontSize:11, textTransform:'uppercase',
              letterSpacing:1, fontWeight:700, fontFamily:"'Lora',serif", marginBottom:12 }}>
              Contact Info
            </p>
            <div className="f-ci">
              <i className="bi bi-geo-alt-fill"></i>
              <span>Palakkad, Kerala, India</span>
            </div>
            <div className="f-ci">
              <i className="bi bi-telephone-fill"></i>
              <a href="tel:04912527770" style={{ color:'inherit', textDecoration:'none' }}>
                0491 2527770
              </a>
            </div>
            <div className="f-ci">
              <i className="bi bi-envelope-fill"></i>
              <span style={{ wordBreak:'break-all' }}>
                universitycollegepkd@university.com
              </span>
            </div>
            <div className="f-ci">
              <i className="bi bi-clock-fill"></i>
              <span>Mon–Sat: 9:00 AM – 5:00 PM</span>
            </div>
          </div>

        </div>

        <hr className="f-divider" />

        {/* Bottom bar with admission reminder */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p className="f-bottom" style={{ margin:0 }}>
            © 2026 University Arts &amp; Science College, Palakkad. All rights reserved.
            &nbsp;|&nbsp; Designed with ❤️ in Kerala
          </p>
          <button
            onClick={onApplyClick}
            style={{
              background:'rgba(255,255,255,.08)', border:'1.5px solid rgba(255,255,255,.15)',
              borderRadius:20, color:'rgba(255,255,255,.7)', fontSize:12, fontWeight:700,
              padding:'6px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:6,
              transition:'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--red)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.color='rgba(255,255,255,.7)' }}
          >
            <i className="bi bi-pencil-square"></i> Apply for Admission
          </button>
        </div>

      </div>
    </footer>
  )
}

export default Footer