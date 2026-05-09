function Hero() {
  return (
    <section id="hero-info" className="hero">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
            <div className="d-flex flex-column flex-sm-row gap-3 mt-4 fu d3">
              <a href="#courses" className="btn-blue">
                <i className="bi bi-book-fill"></i> Explore Courses
              </a>
              <a href="#contact" className="btn-ghost">
                <i className="bi bi-send"></i> Contact Us
              </a>
            </div>

            {/* Stats Bar */}
            <div className="hero-stats fu d4">
              <div className="hs-item">
                <div className="hs-num">14+</div>
                <div className="hs-lbl">Years</div>
              </div>
              <div className="hs-item">
                <div className="hs-num">5K+</div>
                <div className="hs-lbl">Alumni</div>
              </div>
              <div className="hs-item">
                <div className="hs-num">30+</div>
                <div className="hs-lbl">Courses</div>
              </div>
              <div className="hs-item">
                <div className="hs-num">95%</div>
                <div className="hs-lbl">Placement</div>
              </div>
            </div>
          </div>

          {/* ── Right Column — Glance Card ── */}
          <div className="col-lg-6 fu d3">
            <div className="hero-card">
              <div className="hc-title">
                <i className="bi bi-bar-chart-fill me-2"></i>College At a Glance — 2026
              </div>
              <div className="hc-row">
                <div className="hc-ico ico-p"><i className="bi bi-people-fill"></i></div>
                <div>
                  <div className="hc-num">2,500+</div>
                  <div className="hc-lbl">Students Enrolled</div>
                </div>
              </div>
              <div className="hc-row">
                <div className="hc-ico ico-g"><i className="bi bi-person-workspace"></i></div>
                <div>
                  <div className="hc-num">120+</div>
                  <div className="hc-lbl">Expert Faculty Members</div>
                </div>
              </div>
              <div className="hc-row">
                <div className="hc-ico ico-a"><i className="bi bi-trophy-fill"></i></div>
                <div>
                  <div className="hc-num">30+</div>
                  <div className="hc-lbl">Awards &amp; Recognitions</div>
                </div>
              </div>
              <div className="hc-row">
                <div className="hc-ico ico-w"><i className="bi bi-building"></i></div>
                <div>
                  <div className="hc-num">10 Acres</div>
                  <div className="hc-lbl">Green Campus, Palakkad</div>
                </div>
              </div>
              <div>
                <span className="hc-tag">
                  <i className="bi bi-shield-check me-1"></i>NAAC Accredited
                </span>
                <span className="hc-tag ms-2">
                  <i className="bi bi-star-fill me-1"></i>ISO Certified
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero