function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row g-4">

          {/* ── Brand & Social ── */}
          <div className="col-12 col-lg-4">
            <div className="f-brand mb-3">🎓 University College</div>
            <p style={{
              color: 'rgba(255,255,255,.45)', fontSize: 13,
              fontFamily: "'Lora',serif", lineHeight: 1.85
            }}>
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
            <p style={{
              color: 'rgba(255,255,255,.45)', fontSize: 11,
              textTransform: 'uppercase', letterSpacing: 1,
              fontWeight: 700, fontFamily: "'Lora',serif", marginBottom: 12
            }}>
              Quick Links
            </p>
            <div className="d-flex flex-column">
              {['home','about','courses','gallery','contact'].map(link => (
                <a key={link} href={`#${link}`} className="f-link">
                  <i className="bi bi-chevron-right"></i>
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </a>
              ))}
            </div>
          </div>

          {/* ── Courses ── */}
          <div className="col-6 col-lg-2">
            <p style={{
              color: 'rgba(255,255,255,.45)', fontSize: 11,
              textTransform: 'uppercase', letterSpacing: 1,
              fontWeight: 700, fontFamily: "'Lora',serif", marginBottom: 12
            }}>
              Courses
            </p>
            <div className="d-flex flex-column">
              {['Science', 'Computer', 'Commerce'].map(c => (
                <a key={c} href="#courses" className="f-link">
                  <i className="bi bi-chevron-right"></i> {c}
                </a>
              ))}
            </div>
          </div>

          {/* ── Contact Info ── */}
          <div className="col-12 col-lg-4">
            <p style={{
              color: 'rgba(255,255,255,.45)', fontSize: 11,
              textTransform: 'uppercase', letterSpacing: 1,
              fontWeight: 700, fontFamily: "'Lora',serif", marginBottom: 12
            }}>
              Contact Info
            </p>
            <div className="f-ci">
              <i className="bi bi-geo-alt-fill"></i>
              <span>Palakkad, Kerala, India</span>
            </div>
            <div className="f-ci">
              <i className="bi bi-telephone-fill"></i>
              <a href="tel:04912527770" style={{ color: 'inherit', textDecoration: 'none' }}>
                0491 2527770
              </a>
            </div>
            <div className="f-ci">
              <i className="bi bi-envelope-fill"></i>
              <span style={{ wordBreak: 'break-all' }}>
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
        <p className="f-bottom">
          © 2026 University Arts &amp; Science College, Palakkad. All rights reserved.
          &nbsp;|&nbsp; Designed with ❤️ in Kerala
        </p>

      </div>
    </footer>
  )
}

export default Footer