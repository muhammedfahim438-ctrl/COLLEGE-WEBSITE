import { useState, useEffect } from 'react'

function Navbar({ onApplyClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  const closeMenu = () => { setMenuOpen(false); document.body.style.overflow = '' }
  const openMenu  = () => { setMenuOpen(true);  document.body.style.overflow = 'hidden' }

  // Scroll spy + navbar shadow on scroll
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      let active = 'home'
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) active = s.id
      })
      setActiveSection(active)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#home',    label: 'Home',    icon: 'bi-house-fill' },
    { href: '#about',   label: 'About',   icon: 'bi-info-circle-fill' },
    { href: '#courses', label: 'Courses', icon: 'bi-book-fill' },
    { href: '#gallery', label: 'Gallery', icon: 'bi-images' },
    { href: '#contact', label: 'Contact', icon: 'bi-chat-fill' },
  ]

  return (
    <>
      {/* ── TOPBAR (desktop only) ── */}
      <div className="topbar">
        <div className="container d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-envelope me-1"></i>
            universitycollegepkd@university.com &nbsp;|&nbsp;
            <i className="bi bi-telephone me-1"></i>
            0491 2527770
          </span>
          <span>
            Admissions Open 2026 —{' '}
            <button
              onClick={onApplyClick}
              style={{ background:'none', border:'none', padding:0, cursor:'pointer',
                color:'var(--gold)', fontWeight:700, textDecoration:'underline' }}
            >
              Apply Now →
            </button>
          </span>
        </div>
      </div>

      {/* ── MOBILE HEADER ── */}
      <header className="mob-header">
        <div className="mob-brand">
          <div className="mob-logo">🎓</div>
          <div className="mob-name">
            University Arts & Science College
            <small>Palakkad · Est. 2011</small>
          </div>
        </div>
        <div className="mob-actions">
          {/* Apply Now pill — mobile header */}
          <button
            onClick={onApplyClick}
            style={{
              background:'var(--red)', border:'none', borderRadius:20,
              color:'#fff', fontSize:11, fontWeight:700, padding:'5px 12px',
              cursor:'pointer', display:'flex', alignItems:'center', gap:4,
            }}
          >
            <i className="bi bi-pencil-square"></i> Apply
          </button>
          <a href="tel:04912527770" className="mob-call" aria-label="Call us">
            <i className="bi bi-telephone-fill"></i>
          </a>
          <button className="mob-menu-btn" onClick={openMenu} aria-label="Open menu">
            <i className="bi bi-list"></i>
          </button>
        </div>
      </header>

      {/* ── MOBILE OVERLAY MENU ── */}
      <div className={`mob-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="mob-overlay-header">
          <div className="mob-overlay-brand">🎓 University College</div>
          <button className="mob-close" onClick={closeMenu}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="mob-contact-strip">
          <a href="tel:04912527770"><i className="bi bi-telephone-fill"></i> Call Us</a>
          <a href="mailto:universitycollegepkd@university.com"><i className="bi bi-envelope-fill"></i> Email Us</a>
        </div>
        {navLinks.map(link => (
          <a key={link.href} href={link.href} className="mob-nav-item" onClick={closeMenu}>
            <i className={`bi ${link.icon} nav-icon`}></i>
            {link.label}
          </a>
        ))}
        {/* Admission CTA in mobile menu */}
        <button
          onClick={() => { closeMenu(); onApplyClick() }}
          className="mob-enq-btn"
          style={{ width:'100%', border:'none', cursor:'pointer', textAlign:'center' }}
        >
          <i className="bi bi-pencil-square"></i> Apply for Admission 2026
        </button>
        <a href="#contact" className="mob-enq-btn" onClick={closeMenu}
          style={{ background:'rgba(255,255,255,.08)', marginTop:8 }}
        >
          <i className="bi bi-send-fill"></i> Enquire Now
        </a>
      </div>

      {/* ── DESKTOP NAVBAR ── */}
      <nav className="navbar navbar-expand-lg" style={{
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,.15)' : undefined,
        transition: 'box-shadow .3s',
      }}>
        <div className="navbar-main w-100">
          <div className="container d-flex align-items-center">
            <a className="navbar-brand me-auto" href="#home">
              <div className="brand-logo">🎓</div>
              <div>
                <div className="brand-name">
                  University Arts & Science College
                  <small>Palakkad, Kerala · Est. 2011</small>
                </div>
              </div>
            </a>
            <ul className="navbar-nav gap-1 align-items-center mb-0">
              {navLinks.map(link => (
                <li className="nav-item" key={link.href}>
                  <a
                    className={`nav-link ${activeSection === link.href.replace('#','') ? 'act' : ''}`}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {/* Admission button — desktop navbar */}
              <li className="nav-item ms-2">
                <button
                  onClick={onApplyClick}
                  className="nav-link nav-cta"
                  style={{
                    border:'none', cursor:'pointer',
                    background:'linear-gradient(135deg,var(--red),#e63946)',
                    color:'#fff', borderRadius:8, padding:'8px 18px',
                    fontWeight:700, fontSize:13, display:'flex',
                    alignItems:'center', gap:6,
                    boxShadow:'0 4px 12px rgba(204,0,0,.3)',
                    transition:'all .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                >
                  <i className="bi bi-pencil-square"></i> Apply Now
                </button>
              </li>
              <li className="nav-item ms-1">
                <a className="nav-link nav-cta" href="#contact"
                  style={{ background:'transparent', border:'1.5px solid var(--navy)', color:'var(--navy)' }}
                >
                  Enquire
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="bottom-nav">
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={`bn-item ${activeSection === link.href.replace('#','') ? 'active' : ''}`}
          >
            <i className={`bi ${link.icon}`}></i>
            {link.label}
          </a>
        ))}
        {/* Apply Now in mobile bottom nav */}
        <button
          onClick={onApplyClick}
          className="bn-item"
          style={{
            border:'none', cursor:'pointer',
            background:'linear-gradient(135deg,var(--red),#e63946)',
            color:'#fff', borderRadius:10, flex:1,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            gap:2, padding:'4px 0', fontSize:9, fontWeight:800,
          }}
        >
          <i className="bi bi-pencil-square" style={{ fontSize:'1.1rem' }}></i>
          Apply
        </button>
      </nav>
    </>
  )
}

export default Navbar