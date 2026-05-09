import { useState } from 'react'

function About() {
  const [openItem, setOpenItem] = useState('a1')

  const toggle = (id) => {
    setOpenItem(openItem === id ? null : id)
  }

  const items = [
    {
      id: 'a1',
      icon: 'bi-mortarboard-fill',
      iconClass: 'p',
      title: 'Quality Education',
      body: 'Our professional academic programs are designed to focus on career growth, practical knowledge, and real-world skill building. Expert faculty guide students through a curriculum built for tomorrow\'s challenges.',
    },
    {
      id: 'a2',
      icon: 'bi-people-fill',
      iconClass: 'g',
      title: 'Student Management',
      body: 'We maintain an efficient, transparent system for student data, attendance tracking, academic records, and seamless communication between students, faculty, and administration.',
    },
    {
      id: 'a3',
      icon: 'bi-laptop-fill',
      iconClass: 'p',
      title: 'Digital Platform',
      body: 'A modern, web-based platform empowers students and staff with easy access to updates, resources, administration tools, and interactive learning environments — anytime, anywhere.',
    },
    {
      id: 'a4',
      icon: 'bi-trophy-fill',
      iconClass: 'a',
      title: 'Awards & Recognition',
      body: 'Consistently recognized among the top arts and science colleges in Palakkad for academic excellence, research output, and outstanding student placement records year after year.',
    },
  ]

  return (
    <section id="about" className="about-sec">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">

          {/* ── Left Column — Accordion ── */}
          <div className="col-lg-6">
            <div className="sec-badge">About Us</div>
            <h2 className="sec-title">
              Why Choose <span style={{ color: 'var(--p1)' }}>University College?</span>
            </h2>
            <div className="sec-line left mt-2 mb-4"></div>

            <div className="accordion">
              {items.map(item => (
                <div className="accordion-item" key={item.id}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${openItem === item.id ? '' : 'collapsed'}`}
                      onClick={() => toggle(item.id)}
                      type="button"
                    >
                      <div className={`abt-ico ${item.iconClass}`}>
                        <i className={`bi ${item.icon}`}></i>
                      </div>
                      {item.title}
                    </button>
                  </h2>
                  {openItem === item.id && (
                    <div className="accordion-collapse">
                      <div className="accordion-body">{item.body}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column — Stats Visual ── */}
          <div className="col-lg-6">
            <div className="about-vis">
              <p style={{
                fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '1.1px',
                fontWeight: 700, fontFamily: "'Lora',serif", color: 'rgba(255,255,255,.6)',
                position: 'relative', zIndex: 1, marginBottom: 5
              }}>
                Our Numbers
              </p>
              <h3 style={{ fontSize: '1.5rem', position: 'relative', zIndex: 1, color: '#fff', marginBottom: 18 }}>
                Building Futures<br />
                <span style={{ color: 'var(--p3)' }}>Since 2011</span>
              </h3>

              <div className="row g-3" style={{ position: 'relative', zIndex: 1 }}>
                {[
                  { num: '5K+',  lbl: 'Alumni Worldwide' },
                  { num: '95%',  lbl: 'Placement Rate' },
                  { num: '120+', lbl: 'Expert Faculty' },
                  { num: '30+',  lbl: 'Programs Offered' },
                ].map((s, i) => (
                  <div className="col-6" key={i}>
                    <div className="vis-stat">
                      <div className="vis-num">{s.num}</div>
                      <div className="vis-lbl">{s.lbl}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-4 p-3" style={{
                background: 'rgba(255,255,255,.07)', borderRadius: 12,
                border: '1px solid rgba(255,255,255,.1)', position: 'relative', zIndex: 1
              }}>
                <p style={{
                  fontSize: 13, lineHeight: 1.85, fontFamily: "'Lora',serif",
                  color: 'rgba(255,255,255,.82)', margin: 0, fontStyle: 'italic'
                }}>
                  <i className="bi bi-quote" style={{ color: 'var(--p3)', fontSize: '1.1rem' }}></i>
                  {' '}"Education is not preparation for life — education is life itself.
                  At University College, we live that belief every day."
                </p>
                <p style={{
                  color: 'var(--p3)', fontSize: 11, fontFamily: "'Lora',serif",
                  fontWeight: 700, margin: '8px 0 0'
                }}>
                  — Principal, University Arts &amp; Science College
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default About