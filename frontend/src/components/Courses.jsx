import { useState } from 'react'

const tabs = [
  { id: 'science',  label: '🔬 Science'  },
  { id: 'computer', label: '💻 Computer' },
  { id: 'commerce', label: '📊 Commerce' },
]

const courses = {
  science: [
    { icon: 'bi-activity',  title: 'BSc Physics',   desc: 'Study of energy and matter' },
    { icon: 'bi-droplet',   title: 'BSc Chemistry', desc: 'Chemical reactions & compounds' },
    { icon: 'bi-bug',       title: 'BSc Zoology',   desc: 'Study of animals & biology' },
    { icon: 'bi-tree',      title: 'BSc Botany',    desc: 'Study of plants' },
  ],
  computer: [
    { icon: 'bi-code-slash', title: 'BCA',                  desc: 'Programming & software dev' },
    { icon: 'bi-cpu',        title: 'BSc Computer Science', desc: 'Core computing systems' },
    { icon: 'bi-robot',      title: 'BSc AI & ML',          desc: 'Artificial Intelligence' },
    { icon: 'bi-laptop',     title: 'BSc IT',               desc: 'Information Technology' },
  ],
  commerce: [
    { icon: 'bi-cash-stack', title: 'BCom Finance',   desc: 'Accounting & finance' },
    { icon: 'bi-bank',       title: 'BCom Banking',   desc: 'Banking systems' },
    { icon: 'bi-graph-up',   title: 'BCom Marketing', desc: 'Business marketing' },
    { icon: 'bi-receipt',    title: 'BCom Taxation',  desc: 'Tax systems' },
  ],
}

function CourseCard({ icon, title, desc }) {
  return (
    <div className="col-6 col-md-3">
      <div className="course-card">
        <div className="c-ico"><i className={`bi ${icon}`}></i></div>
        <h6>{title}</h6>
        <small>{desc}</small><br />
        <span className="c-badge">3 Years</span>
      </div>
    </div>
  )
}

function Courses() {
  const [activeTab, setActiveTab] = useState('science')

  return (
    <section id="courses" className="courses-sec">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-4">
          <div className="sec-badge">Academic Programs</div>
          <h2 className="sec-title">Our Courses</h2>
          <div className="sec-line"></div>
        </div>

        {/* Tabs */}
        <ul className="nav tab-nav d-flex">
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Course Cards */}
        <div className="row g-3">
          {courses[activeTab].map((course, i) => (
            <CourseCard key={i} {...course} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Courses