import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Public Website
import Navbar    from './components/Navbar'
import Carousel  from './components/Carousel'
import Hero      from './components/Hero'
import About     from './components/About'
import Courses   from './components/Courses'
import Gallery   from './components/Gallery'
import Contact   from './components/Contact'
import Footer    from './components/Footer'
import Admission from './components/Admission'
import AdmissionModal from './components/AdmissionModal'

import ScrollTop from './components/ScrollTop'
import AdminLogin     from './admin/Login'
import AdminApp       from './admin/AdminApp'
import ProtectedRoute from './admin/ProtectedRoute'

// Public single page — AdmissionModal state lives here so Navbar, Hero, Footer can all open it
function PublicSite() {
  const [admissionOpen, setAdmissionOpen] = useState(false)

  return (
    <>
      <Navbar onApplyClick={() => setAdmissionOpen(true)} />
      <Carousel />
      <Hero onApplyClick={() => setAdmissionOpen(true)} />
      <About />
      <Courses />
      <Admission onApplyClick={() => setAdmissionOpen(true)} />
      <Gallery />
      <Contact />
      <Footer onApplyClick={() => setAdmissionOpen(true)} />
      <ScrollTop />
      {admissionOpen && <AdmissionModal onClose={() => setAdmissionOpen(false)} />}
    </>
  )
}

function App() {
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem('adminToken')
      sessionStorage.removeItem('adminUsername')
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/portal/login" element={<AdminLogin />} />
        <Route path="/portal/*" element={
          <ProtectedRoute>
            <AdminApp />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App