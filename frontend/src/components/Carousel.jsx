import { useState, useEffect, useRef } from 'react'

function Carousel() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  // Fetch carousel data from Django API
  useEffect(() => {
    fetch('/api/carousel/')
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(() => setSlides([]))
  }, [])

  // Auto slide every 5 seconds
  useEffect(() => {
    if (slides.length === 0) return
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [slides])

  const goTo = (i) => {
    clearInterval(timerRef.current)
    setCurrent(i)
  }
  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = () => goTo((current + 1) % slides.length)

  // Fallback slide if no data yet
  const fallback = [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600', title: '' },
  ]
  const items = slides.length > 0 ? slides : fallback

  return (
    <section id="home">
      <div className="hero-carousel">

        {/* Indicators */}
        <div className="carousel-indicators" style={{position:'absolute',bottom:32,zIndex:15}}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? 28 : 9,
                height: 9,
                borderRadius: i === current ? 5 : '50%',
                background: i === current ? 'var(--p2)' : 'rgba(255,255,255,.35)',
                border: `2px solid ${i === current ? 'var(--p2)' : 'rgba(255,255,255,.5)'}`,
                margin: '0 4px',
                transition: '.3s',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Slides */}
        <div style={{width:'100%',height:'100%',position:'relative'}}>
          {items.map((slide, i) => (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: i === current ? 1 : 0,
                transition: 'opacity .8s ease',
                pointerEvents: i === current ? 'auto' : 'none',
              }}
            >
              <img
                src={slide.image_url || slide.image}
                alt={slide.title || 'Campus'}
                style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block'}}
              />
              {/* Dark overlay */}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(12,26,46,.2) 0%,rgba(12,26,46,.55) 50%,rgba(12,26,46,.8) 100%)'}}></div>
              {/* Caption */}
              <div className="hc-caption">
                <div className="hc-badge">
                  <i className="bi bi-patch-check-fill"></i> Est. 2011 — Premier Institution
                </div>
                <h2>
                  {slide.title
                    ? slide.title
                    : <>University Arts & <span>Science College</span></>
                  }
                </h2>
                <p>A premier institution in Palakkad, Kerala — dedicated to academic excellence &amp; holistic development.</p>
                <a href="#courses" className="hc-btn">
                  <i className="bi bi-book-fill"></i> Explore Courses
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Prev Button */}
        <button
          onClick={prev}
          style={{position:'absolute',left:0,top:0,bottom:0,width:56,background:'none',border:'none',display:'flex',alignItems:'center',justifyContent:'center',zIndex:15,cursor:'pointer'}}
          aria-label="Previous"
        >
          <span className="hcar-ctrl"><i className="bi bi-chevron-left"></i></span>
        </button>

        {/* Next Button */}
        <button
          onClick={next}
          style={{position:'absolute',right:0,top:0,bottom:0,width:56,background:'none',border:'none',display:'flex',alignItems:'center',justifyContent:'center',zIndex:15,cursor:'pointer'}}
          aria-label="Next"
        >
          <span className="hcar-ctrl"><i className="bi bi-chevron-right"></i></span>
        </button>

        {/* Scroll Hint */}
        <a href="#hero-info" className="scroll-hint">
          <i className="bi bi-chevron-double-down"></i>
          <span>Scroll</span>
        </a>

      </div>
    </section>
  )
}

export default Carousel