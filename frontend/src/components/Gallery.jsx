import { useState, useEffect } from 'react'

function Gallery() {
  const [images, setImages]   = useState([])
  const [lbOpen, setLbOpen]   = useState(false)
  const [lbIndex, setLbIndex] = useState(0)

  // Fetch gallery images from Django API
  useEffect(() => {
    fetch('/api/gallery/')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(() => setImages([]))
  }, [])

  // Open lightbox
  const openLb = (i) => {
    setLbIndex(i)
    setLbOpen(true)
    document.body.style.overflow = 'hidden'
  }

  // Close lightbox
  const closeLb = () => {
    setLbOpen(false)
    document.body.style.overflow = ''
  }

  // Navigate lightbox
  const nav = (dir) => {
    setLbIndex(i => (i + dir + images.length) % images.length)
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (!lbOpen) return
      if (e.key === 'ArrowRight') nav(1)
      if (e.key === 'ArrowLeft')  nav(-1)
      if (e.key === 'Escape')     closeLb()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lbOpen, images.length])

  return (
    <>
      <section id="gallery" className="gallery-sec">
        <div className="container">

          {/* Header */}
          <div className="text-center mb-4">
            <div className="sec-badge">Campus Life</div>
            <h2 className="sec-title">Gallery</h2>
            <div className="sec-line"></div>
            <p className="mt-3" style={{ color: 'var(--muted)', fontSize: '13.5px', fontFamily: "'Lora',serif" }}>
              Moments that define life at University College, Palakkad
            </p>
          </div>

          {/* Grid */}
          <div className="g-grid">
            {images.length === 0 ? (
              <div className="g-empty">
                <i className="bi bi-images" style={{ fontSize: '2.8rem', color: 'var(--p-border)' }}></i>
                <p className="mt-3">Gallery images will appear here.</p>
              </div>
            ) : (
              images.map((img, i) => (
                <div
                  className="g-item"
                  key={img.id}
                  onClick={() => openLb(i)}
                >
                  <img
                    src={img.image_url || img.image}
                    alt="Gallery"
                    loading="lazy"
                  />
                  <div className="g-overlay">
                    <span className="g-lbl">
                      <i className="bi bi-image me-1"></i>Campus Photo
                    </span>
                  </div>
                  <div className="g-zoom">
                    <i className="bi bi-zoom-in"></i>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {lbOpen && (
        <div
          className="lb-bg open"
          onClick={(e) => { if (e.target === e.currentTarget) closeLb() }}
        >
          <div className="lb-inner">
            <button className="lb-close" onClick={closeLb}>✕</button>
            <button className="lb-nav lb-prev" onClick={() => nav(-1)}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <img
              src={images[lbIndex]?.image_url || images[lbIndex]?.image}
              alt="Gallery"
            />
            <button className="lb-nav lb-next" onClick={() => nav(1)}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Gallery