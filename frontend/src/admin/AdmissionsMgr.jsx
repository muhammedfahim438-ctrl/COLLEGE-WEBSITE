import { useState, useEffect } from 'react'
import { s, Modal, Confirm } from './adminStyles'
import Pagination from './Pagination'

function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

export default function AdmissionsMgr() {
  const [apps, setApps]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [viewApp, setViewApp]       = useState(null)
  const [confirm, setConfirm]       = useState(null)
  const [downloading, setDownloading] = useState(null) // track which app is downloading

  const load = (p = 1) => {
    setLoading(true)
    let url = `/admissions/list/?page=${p}`
    if (filterStatus) url += `&status=${filterStatus}`
    if (filterCourse) url += `&course=${encodeURIComponent(filterCourse)}`
    fetch(url, { credentials:'include' })
      .then(r => r.json())
      .then(d => {
        setApps(d.applications || [])
        setPage(d.page || 1)
        setTotalPages(d.total_pages || 1)
        setTotal(d.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load(1) }, [filterStatus, filterCourse])

  const deleteApp = async id => {
    const res = await fetch(`/admissions/delete/${id}/`, {
      method:'POST', credentials:'include',
      headers:{ 'X-CSRFToken':getCsrf() }
    })
    const d = await res.json()
    if (d.success) load(page); else alert(d.error||'Failed.')
    setConfirm(null)
  }

  // ── Download Receipt PDF ──────────────────────────────────────
  const downloadReceipt = async (app) => {
    setDownloading(app.id)
    try {
      const res = await fetch(`/admissions/receipt/${app.id}/`, {
        credentials: 'include',
      })
      if (!res.ok) { alert('Failed to generate receipt.'); setDownloading(null); return }

      const blob = await res.blob()
      const url  = window.URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `Admission_Receipt_${app.id}_${app.name.replace(/\s+/g,'_')}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      alert('Error downloading receipt.')
    }
    setDownloading(null)
  }

  const exportCSV = () => {
    const headers = ['#','Name','Email','Phone','Course','Gender','Father','Father Phone','Mother','Mother Phone','Qualification','Prev Course','Prev College','Place','Year','Payment','Payment ID','Date']
    const rows = apps.map((a,i) => [
      i+1, a.name, a.email, a.phone, a.course, a.gender,
      a.father_name, a.father_phone, a.mother_name, a.mother_phone,
      a.prev_qualification, a.prev_course_name, a.prev_college_name,
      a.prev_college_place, a.year_of_passing,
      a.payment_status, a.razorpay_payment_id||'', a.created_at
    ])
    const csv = [headers,...rows].map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,'+encodeURIComponent(csv)
    a.download = 'admissions.csv'; a.click()
  }

  const filtered = apps.filter(a => {
    const q = search.toLowerCase()
    return !q || (a.name+a.email+a.course+a.phone).toLowerCase().includes(q)
  })

  const statusBadge = status => {
    const styles = {
      paid:    { background:'#d1fae5', color:'#065f46', border:'1px solid #a7f3d0' },
      pending: { background:'#fef3c7', color:'#92400e', border:'1px solid #fcd34d' },
      failed:  { background:'#fee2e2', color:'#991b1b', border:'1px solid #fca5a5' },
    }
    return {
      display:'inline-block', padding:'3px 10px', borderRadius:20,
      fontSize:11, fontWeight:700, fontFamily:"'Inter',sans-serif",
      ...(styles[status] || styles.pending),
    }
  }

  // Receipt button style
  const receiptBtn = (appId) => ({
    display:'inline-flex', alignItems:'center', gap:5,
    padding:'5px 10px', borderRadius:8, fontSize:12, fontWeight:700,
    cursor: downloading === appId ? 'not-allowed' : 'pointer',
    border:'1.5px solid rgba(5,150,105,.3)',
    background: downloading === appId ? '#f0fdf4' : 'rgba(5,150,105,.08)',
    color:'#059669',
    transition:'all .2s',
    fontFamily:"'Inter',sans-serif",
  })

  return (
    <div>
      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <h4 style={s.pageTitle}>Admissions</h4>
          <p style={s.pageSubtitle}>Manage admission applications</p>
        </div>
        <button onClick={exportCSV} style={s.csvBtn}>
          <i className="bi bi-download me-1"></i>CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ ...s.searchWrap, flex:2, minWidth:180 }}>
          <i className="bi bi-search" style={s.searchIcon}></i>
          <input type="text" placeholder="Search name, email, course..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...s.searchInput, borderRadius:12 }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ ...s.select, borderRadius:12 }}>
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Count */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#6366f1', background:'#eef2ff', padding:'5px 12px', borderRadius:20 }}>
          {total} applications total
        </div>
        {filterStatus === 'paid' && (
          <div style={{ fontSize:12, fontWeight:700, color:'#065f46', background:'#d1fae5', padding:'5px 12px', borderRadius:20 }}>
            ₹{total * 500} collected
          </div>
        )}
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="mgr-desktop">
        <div style={s.card}>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['#','Name','Course','Phone','Payment','Date','Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={s.emptyTd}>
                    <i className="bi bi-hourglass-split me-2"></i>Loading...
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" style={s.emptyTd}>
                    <i className="bi bi-mortarboard" style={{ fontSize:'2rem', color:'#e2e8f4', display:'block', margin:'0 auto 8px' }}></i>
                    No applications found.
                  </td></tr>
                ) : filtered.map((a, i) => (
                  <tr key={a.id} style={s.tr}
                    onMouseEnter={e => e.currentTarget.style.background='#fafbff'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <td style={s.td}><span style={s.indexBadge}>{(page-1)*10+i+1}</span></td>
                    <td style={s.td}>
                      <div style={{ fontWeight:700, color:'#1e1b4b' }}>{a.name}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{a.email}</div>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.courseBadge, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block' }}>
                        {a.course}
                      </span>
                    </td>
                    <td style={s.td}>{a.phone}</td>
                    <td style={s.td}><span style={statusBadge(a.payment_status)}>{a.payment_status}</span></td>
                    <td style={{ ...s.td, fontSize:12, color:'#64748b', whiteSpace:'nowrap' }}>{a.created_at}</td>
                    <td style={s.td}>
                      <div style={{ ...s.actionBtns, flexWrap:'wrap', gap:6 }}>
                        {/* View button */}
                        <button onClick={() => setViewApp(a)} style={s.viewBtn}>
                          <i className="bi bi-eye-fill me-1"></i>View
                        </button>
                        {/* Receipt PDF button — only for paid */}
                        {a.payment_status === 'paid' && (
                          <button
                            onClick={() => downloadReceipt(a)}
                            disabled={downloading === a.id}
                            style={receiptBtn(a.id)}
                            title="Download PDF Receipt"
                            onMouseEnter={e => { if(downloading !== a.id){ e.currentTarget.style.background='#059669'; e.currentTarget.style.color='#fff' }}}
                            onMouseLeave={e => { e.currentTarget.style.background='rgba(5,150,105,.08)'; e.currentTarget.style.color='#059669' }}
                          >
                            {downloading === a.id
                              ? <><i className="bi bi-hourglass-split"></i> Generating...</>
                              : <><i className="bi bi-file-earmark-pdf-fill"></i> Receipt</>
                            }
                          </button>
                        )}
                        {/* Delete button */}
                        <button onClick={() => setConfirm(a.id)} style={s.delBtn}>
                          <i className="bi bi-trash-fill me-1"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={p => load(p)} />
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="mgr-mobile">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>No applications found.</div>
        ) : (
          <>
            {filtered.map(a => (
              <div key={a.id} style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:12, boxShadow:'0 4px 16px rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.06)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16, flexShrink:0 }}>
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:15, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.name}</div>
                    <div style={{ fontSize:12, color:'#64748b', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.email}</div>
                  </div>
                  <span style={statusBadge(a.payment_status)}>{a.payment_status}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Course</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#1e1b4b', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.course}</div>
                  </div>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Phone</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#1e1b4b', marginTop:2 }}>{a.phone}</div>
                  </div>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Amount</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#065f46', marginTop:2 }}>₹{a.amount}</div>
                  </div>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Date</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#1e1b4b', marginTop:2 }}>{(a.created_at||'').split(',')[0]}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button onClick={() => setViewApp(a)} style={{ ...s.viewBtn, flex:2, justifyContent:'center', padding:'11px', display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
                    <i className="bi bi-eye-fill"></i> View Details
                  </button>
                  {/* Mobile Receipt button */}
                  {a.payment_status === 'paid' && (
                    <button
                      onClick={() => downloadReceipt(a)}
                      disabled={downloading === a.id}
                      style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'11px', borderRadius:10, border:'1.5px solid rgba(5,150,105,.3)', background:'rgba(5,150,105,.08)', color:'#059669', fontWeight:700, fontSize:13, cursor:'pointer' }}
                    >
                      {downloading === a.id
                        ? <><i className="bi bi-hourglass-split"></i> Wait...</>
                        : <><i className="bi bi-file-earmark-pdf-fill"></i> Receipt</>
                      }
                    </button>
                  )}
                  <button onClick={() => setConfirm(a.id)} style={{ ...s.delBtn, flex:1, justifyContent:'center', padding:'11px', display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            ))}
            <Pagination page={page} totalPages={totalPages} onPageChange={p => load(p)} />
          </>
        )}
      </div>

      {/* View Modal */}
      {viewApp && (
        <Modal title={`Application #${viewApp.id}`} onClose={() => setViewApp(null)}>
          {/* Status badge */}
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <span style={{ ...statusBadge(viewApp.payment_status), fontSize:13, padding:'6px 18px' }}>
              {viewApp.payment_status === 'paid' ? '✅ Payment Confirmed' : viewApp.payment_status === 'pending' ? '⏳ Payment Pending' : '❌ Payment Failed'}
            </span>
          </div>

          {[
            { title:'Personal Information', fields:[
              { l:'Full Name',     v:viewApp.name },
              { l:'Email',         v:viewApp.email },
              { l:'Phone',         v:viewApp.phone },
              { l:'Date of Birth', v:viewApp.date_of_birth },
              { l:'Gender',        v:viewApp.gender },
              { l:'Address',       v:viewApp.address },
            ]},
            { title:'Parents Details', fields:[
              { l:"Father's Name",  v:viewApp.father_name },
              { l:"Father's Phone", v:viewApp.father_phone },
              { l:"Mother's Name",  v:viewApp.mother_name },
              { l:"Mother's Phone", v:viewApp.mother_phone },
            ]},
            { title:'Academic Info', fields:[
              { l:'Course Applied',     v:viewApp.course },
              { l:'Prev Qualification', v:viewApp.prev_qualification },
              { l:'Prev Course Name',   v:viewApp.prev_course_name },
              { l:'Prev College Name',  v:viewApp.prev_college_name },
              { l:'Prev College Place', v:viewApp.prev_college_place },
              { l:'Year of Passing',    v:viewApp.year_of_passing },
            ]},
            { title:'Payment Info', fields:[
              { l:'Amount',     v:`₹${viewApp.amount}` },
              { l:'Status',     v:viewApp.payment_status },
              { l:'Payment ID', v:viewApp.razorpay_payment_id||'—' },
              { l:'Applied On', v:viewApp.created_at },
            ]},
          ].map(section => (
            <div key={section.title} style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#6366f1', textTransform:'uppercase', letterSpacing:1, marginBottom:10, fontFamily:"'Inter',sans-serif" }}>
                {section.title}
              </div>
              <div style={{ background:'#f8fafc', borderRadius:12, overflow:'hidden', border:'1px solid #e8ecf4' }}>
                {section.fields.map((f, i) => (
                  <div key={f.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'9px 14px', borderBottom: i < section.fields.length-1 ? '1px solid #f1f5f9' : 'none', gap:10 }}>
                    <span style={{ fontSize:12, color:'#94a3b8', fontWeight:600, flexShrink:0 }}>{f.l}</span>
                    <span style={{ fontSize:13, color:'#1e1b4b', fontWeight:600, textAlign:'right' }}>{f.v||'—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Download receipt inside modal too */}
          <div style={{ display:'flex', gap:10 }}>
            {viewApp.payment_status === 'paid' && (
              <button
                onClick={() => downloadReceipt(viewApp)}
                disabled={downloading === viewApp.id}
                style={{ flex:1, padding:'12px', border:'none', borderRadius:12, background:'linear-gradient(135deg,#059669,#10b981)', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
              >
                {downloading === viewApp.id
                  ? <><i className="bi bi-hourglass-split"></i> Generating PDF...</>
                  : <><i className="bi bi-file-earmark-pdf-fill"></i> Download Receipt PDF</>
                }
              </button>
            )}
            <button onClick={() => setViewApp(null)} style={{ flex:1, ...s.saveBtn, background:'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
              Close
            </button>
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          onCancel={() => setConfirm(null)}
          onConfirm={() => deleteApp(confirm)}
          msg="This admission application will be permanently deleted."
        />
      )}

      <style>{`
        @media(min-width:769px){ .mgr-mobile{ display:none } .mgr-desktop{ display:block } }
        @media(max-width:768px){ .mgr-desktop{ display:none } .mgr-mobile{ display:block } }
      `}</style>
    </div>
  )
}