import { useState, useEffect } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Close menu helper
  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  // Open menu helper
  const openMenu = () => {
    setMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }

  // Scroll spy — highlights active nav link
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const onScroll = () => {
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
          <span>Admissions Open 2026 — <a href="#contact">Enquire Now →</a></span>
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
          <a
            key={link.href}
            href={link.href}
            className="mob-nav-item"
            onClick={closeMenu}
          >
            <i className={`bi ${link.icon} nav-icon`}></i>
            {link.label}
          </a>
        ))}
        <a href="#contact" className="mob-enq-btn" onClick={closeMenu}>
          <i className="bi bi-send-fill"></i> Enquire Now — Admissions 2026
        </a>
      </div>

      {/* ── DESKTOP NAVBAR ── */}
      <nav className="navbar navbar-expand-lg">
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
              <li className="nav-item ms-2">
                <a className="nav-link nav-cta" href="#contact">Enquire Now</a>
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
            className={`bn-item ${link.href === '#contact' ? 'bn-enq' : ''} ${activeSection === link.href.replace('#','') ? 'active' : ''}`}
          >
            <i className={`bi ${link.icon}`}></i>
            {link.label}
          </a>
        ))}
      </nav>
    </>
  )
}

export default Navbar