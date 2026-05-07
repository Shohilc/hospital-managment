import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdArrowBack, MdUploadFile, MdClose, MdPrint } from 'react-icons/md';

const PATIENT = {
  name: 'Alice Johnson', age: 34, gender: 'Female', bloodGroup: 'A+',
  phone: '9876500001', email: 'alice@gmail.com', address: '12, Rose Street, Chennai, TN - 600001',
  emergency: '9876500011', patientId: 'P-001',
  medicalHistory: 'Hypertension (diagnosed 2019). No known drug allergies. Family history of diabetes.',
  joined: 'Jan 2024',
};

const APPOINTMENTS = [
  { id: 1, date: '2026-05-07', time: '09:00', doctor: 'Dr. James Wilson', dept: 'Cardiology',   reason: 'Chest pain follow-up', status: 'Completed' },
  { id: 2, date: '2026-04-20', time: '10:30', doctor: 'Dr. Priya Sharma',  dept: 'Gynecology',  reason: 'Routine checkup',      status: 'Completed' },
  { id: 3, date: '2026-03-15', time: '11:00', doctor: 'Dr. James Wilson',  dept: 'Cardiology',  reason: 'ECG review',           status: 'Completed' },
  { id: 4, date: '2026-05-14', time: '09:30', doctor: 'Dr. Sarah Lee',     dept: 'Neurology',   reason: 'Headache evaluation',  status: 'Upcoming'  },
];

const BILLS = [
  { id: 'INV-001', date: '2026-05-07', desc: 'Cardiology Consultation', amount: 800,  status: 'Paid'    },
  { id: 'INV-002', date: '2026-04-20', desc: 'Gynecology Consultation', amount: 600,  status: 'Paid'    },
  { id: 'INV-003', date: '2026-03-15', desc: 'ECG + Consultation',      amount: 1100, status: 'Paid'    },
  { id: 'INV-004', date: '2026-05-14', desc: 'Neurology Consultation',  amount: 900,  status: 'Pending' },
];

const LAB_SAMPLE = [
  { name: 'CBC Report - May 2026',   date: '2026-05-07', type: 'pdf' },
  { name: 'ECG Scan - Mar 2026',     date: '2026-03-15', type: 'image' },
];

const APPT_STATUS = {
  Completed: { bg: '#e6f4ea', color: '#1e8e3e' },
  Upcoming:  { bg: '#e8f0fe', color: '#1a73e8' },
  Cancelled: { bg: '#fce8e6', color: '#d93025' },
};

const BILL_STATUS = {
  Paid:    { bg: '#e6f4ea', color: '#1e8e3e' },
  Pending: { bg: '#fef7e0', color: '#9a6700' },
};

const TABS = ['Overview', 'Appointments', 'Lab Reports', 'Billing'];

export default function PatientProfile() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [tab, setTab] = useState('Overview');
  const [labFiles, setLabFiles] = useState(LAB_SAMPLE);
  const [editOpen, setEditOpen] = useState(false);
  const [patient, setPatient] = useState(PATIENT);
  const [editForm, setEditForm] = useState(PATIENT);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (incoming) => {
    const newFiles = Array.from(incoming).map(f => ({
      name: f.name, date: new Date().toISOString().split('T')[0],
      type: f.type.includes('pdf') ? 'pdf' : 'image',
    }));
    setLabFiles(p => [...p, ...newFiles]);
  };

  const inp = { width:'100%', padding:'10px 12px', border:'1px solid #e0e0e0', borderRadius:8, fontSize:13.5, color:'#202124', outline:'none', fontFamily:'Inter,sans-serif', boxSizing:'border-box' };
  const lbl = { fontSize:12, fontWeight:500, color:'#5f6368', display:'block', marginBottom:5 };

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa', fontFamily:'Inter,sans-serif' }}>

      {/* Nav */}
      <nav style={{ background:'#fff', borderBottom:'1px solid #e0e0e0', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:30, height:30, background:'#1a73e8', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontSize:15, fontWeight:600, color:'#202124' }}>MediCore HMS</span>
        </div>
        <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', color:'#5f6368', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
          <MdArrowBack style={{ fontSize:16 }} /> Back
        </button>
      </nav>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'32px 24px' }}>

        {/* ── Profile Header Card ── */}
        <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:16, padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, boxShadow:'0 1px 4px rgba(60,64,67,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            {/* Avatar */}
            <div style={{ width:72, height:72, borderRadius:'50%', background:'#1a73e8', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, flexShrink:0 }}>
              {patient.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <h1 style={{ fontSize:22, fontWeight:600, color:'#202124', margin:0 }}>{patient.name}</h1>
                <span style={{ fontSize:11, background:'#e8f0fe', color:'#1a73e8', padding:'3px 10px', borderRadius:20, fontWeight:500 }}>{patient.patientId}</span>
              </div>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                {[
                  { icon:'🎂', v: `${patient.age} years` },
                  { icon:'⚧', v: patient.gender },
                  { icon:'🩸', v: patient.bloodGroup },
                  { icon:'📞', v: patient.phone },
                  { icon:'📅', v: `Member since ${patient.joined}` },
                ].map((item, i) => (
                  <span key={i} style={{ fontSize:13, color:'#5f6368', display:'flex', alignItems:'center', gap:5 }}>
                    {item.icon} {item.v}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => { setEditForm(patient); setEditOpen(true); }}
            style={{ display:'flex', alignItems:'center', gap:6, background:'#1a73e8', color:'#fff', border:'none', borderRadius:24, padding:'9px 18px', fontSize:13, fontWeight:500, cursor:'pointer' }}>
            <MdEdit style={{ fontSize:16 }} /> Edit Profile
          </button>
        </div>

        {/* ── Tab Bar ── */}
        <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:12, overflow:'hidden', marginBottom:20, display:'flex' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'13px 0', fontSize:13.5, fontWeight: tab===t ? 600 : 400, color: tab===t ? '#1a73e8' : '#5f6368', background:'none', border:'none', borderBottom: `2px solid ${tab===t ? '#1a73e8' : 'transparent'}`, cursor:'pointer', transition:'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {tab === 'Overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {/* Contact Info */}
            <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, padding:24 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:'#202124', marginBottom:16, paddingBottom:10, borderBottom:'1px solid #f1f3f4' }}>Contact Information</h3>
              {[
                { label:'Phone', value: patient.phone },
                { label:'Email', value: patient.email },
                { label:'Address', value: patient.address },
                { label:'Emergency Contact', value: patient.emergency },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:3 }}>{r.label}</div>
                  <div style={{ fontSize:13.5, color:'#202124' }}>{r.value}</div>
                </div>
              ))}
            </div>
            {/* Medical History */}
            <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, padding:24 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:'#202124', marginBottom:16, paddingBottom:10, borderBottom:'1px solid #f1f3f4' }}>Medical History</h3>
              <div style={{ background:'#fef7e0', border:'1px solid #fdd7a0', borderRadius:10, padding:'14px 16px', fontSize:13.5, color:'#5f6368', lineHeight:1.7 }}>
                {patient.medicalHistory}
              </div>
              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#9aa0a6', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Quick Stats</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[
                    { label:'Total Visits', value: APPOINTMENTS.filter(a=>a.status==='Completed').length },
                    { label:'Upcoming',     value: APPOINTMENTS.filter(a=>a.status==='Upcoming').length },
                    { label:'Lab Reports',  value: labFiles.length },
                    { label:'Total Billed', value: `₹${BILLS.reduce((s,b)=>s+b.amount,0).toLocaleString()}` },
                  ].map((s,i) => (
                    <div key={i} style={{ background:'#f8f9fa', borderRadius:10, padding:'12px 14px', textAlign:'center' }}>
                      <div style={{ fontSize:20, fontWeight:600, color:'#1a73e8' }}>{s.value}</div>
                      <div style={{ fontSize:11, color:'#9aa0a6', marginTop:2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Appointments Tab ── */}
        {tab === 'Appointments' && (
          <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f3f4', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:15, fontWeight:600, color:'#202124' }}>Appointment History</h3>
              <span style={{ fontSize:12, color:'#9aa0a6' }}>{APPOINTMENTS.length} total</span>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#f8f9fa' }}>
                  {['Date & Time','Doctor','Department','Reason','Status'].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'11px 20px', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', color:'#9aa0a6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {APPOINTMENTS.map((a, i) => {
                  const s = APPT_STATUS[a.status] || APPT_STATUS.Completed;
                  return (
                    <tr key={a.id} style={{ borderBottom:'1px solid #f1f3f4' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='#fff'}>
                      <td style={{ padding:'14px 20px' }}>
                        <div style={{ fontSize:13.5, fontWeight:500, color:'#202124' }}>{a.date}</div>
                        <div style={{ fontSize:11, color:'#9aa0a6' }}>{a.time}</div>
                      </td>
                      <td style={{ padding:'14px 20px', fontSize:13.5, color:'#202124', fontWeight:500 }}>{a.doctor}</td>
                      <td style={{ padding:'14px 20px' }}>
                        <span style={{ background:'#e8f0fe', color:'#1a73e8', fontSize:11, fontWeight:500, padding:'3px 9px', borderRadius:20 }}>{a.dept}</span>
                      </td>
                      <td style={{ padding:'14px 20px', fontSize:13, color:'#5f6368' }}>{a.reason}</td>
                      <td style={{ padding:'14px 20px' }}>
                        <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{a.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Lab Reports Tab ── */}
        {tab === 'Lab Reports' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Upload zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current.click()}
              style={{ background: dragOver ? '#e8f0fe' : '#fff', border:`2px dashed ${dragOver ? '#1a73e8' : '#d0d0d0'}`, borderRadius:14, padding:'32px 20px', textAlign:'center', cursor:'pointer', transition:'all 0.15s' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
              <p style={{ fontSize:14, fontWeight:500, color:'#5f6368', margin:'0 0 4px' }}>
                Drag & drop lab reports, or <span style={{ color:'#1a73e8', textDecoration:'underline' }}>browse</span>
              </p>
              <p style={{ fontSize:11, color:'#9aa0a6', margin:0 }}>PDF, JPG, PNG supported</p>
              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
            </div>
            {/* Files list */}
            <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, overflow:'hidden' }}>
              <div style={{ padding:'16px 24px', borderBottom:'1px solid #f1f3f4' }}>
                <h3 style={{ fontSize:15, fontWeight:600, color:'#202124' }}>Uploaded Reports ({labFiles.length})</h3>
              </div>
              {labFiles.length === 0 ? (
                <div style={{ padding:'48px 20px', textAlign:'center', color:'#9aa0a6', fontSize:14 }}>No reports uploaded yet.</div>
              ) : labFiles.map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 24px', borderBottom: i < labFiles.length-1 ? '1px solid #f1f3f4' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background='#fff'}>
                  <span style={{ fontSize:26 }}>{f.type === 'pdf' ? '📄' : '🖼️'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:500, color:'#202124' }}>{f.name}</div>
                    <div style={{ fontSize:11, color:'#9aa0a6', marginTop:2 }}>Uploaded: {f.date}</div>
                  </div>
                  <button style={{ display:'flex', alignItems:'center', gap:4, background:'#f8f9fa', border:'1px solid #e0e0e0', borderRadius:20, padding:'5px 12px', fontSize:12, color:'#5f6368', cursor:'pointer' }}>
                    <MdPrint style={{ fontSize:14 }} /> View
                  </button>
                  <button onClick={() => setLabFiles(p => p.filter((_,j) => j !== i))}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#9aa0a6', fontSize:18, display:'flex', alignItems:'center' }}
                    onMouseEnter={e => e.currentTarget.style.color='#d93025'}
                    onMouseLeave={e => e.currentTarget.style.color='#9aa0a6'}>
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Billing Tab ── */}
        {tab === 'Billing' && (
          <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f3f4', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:15, fontWeight:600, color:'#202124' }}>Billing History</h3>
              <div style={{ display:'flex', gap:16 }}>
                <span style={{ fontSize:13, color:'#1e8e3e', fontWeight:500 }}>Paid: ₹{BILLS.filter(b=>b.status==='Paid').reduce((s,b)=>s+b.amount,0).toLocaleString()}</span>
                <span style={{ fontSize:13, color:'#f29900', fontWeight:500 }}>Pending: ₹{BILLS.filter(b=>b.status==='Pending').reduce((s,b)=>s+b.amount,0).toLocaleString()}</span>
              </div>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#f8f9fa' }}>
                  {['Invoice ID','Date','Description','Amount','Status','Action'].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'11px 20px', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', color:'#9aa0a6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BILLS.map((b, i) => {
                  const s = BILL_STATUS[b.status] || BILL_STATUS.Pending;
                  return (
                    <tr key={b.id} style={{ borderBottom:'1px solid #f1f3f4' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background='#fff'}>
                      <td style={{ padding:'14px 20px', fontSize:13, fontWeight:600, color:'#1a73e8' }}>{b.id}</td>
                      <td style={{ padding:'14px 20px', fontSize:13, color:'#5f6368' }}>{b.date}</td>
                      <td style={{ padding:'14px 20px', fontSize:13.5, color:'#202124' }}>{b.desc}</td>
                      <td style={{ padding:'14px 20px', fontSize:14, fontWeight:600, color:'#202124' }}>₹{b.amount.toLocaleString()}</td>
                      <td style={{ padding:'14px 20px' }}>
                        <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{b.status}</span>
                      </td>
                      <td style={{ padding:'14px 20px' }}>
                        <button style={{ display:'flex', alignItems:'center', gap:4, background:'#f8f9fa', border:'1px solid #e0e0e0', borderRadius:20, padding:'5px 12px', fontSize:12, color:'#5f6368', cursor:'pointer' }}>
                          <MdPrint style={{ fontSize:13 }} /> Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(32,33,36,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 8px 24px rgba(60,64,67,0.18)' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f3f4', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:16, fontWeight:600, color:'#202124' }}>Edit Patient Profile</h3>
              <button onClick={() => setEditOpen(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9aa0a6' }}>✕</button>
            </div>
            <div style={{ padding:24, display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { key:'fullName', label:'Full Name' },
                { key:'age',      label:'Age', type:'number' },
                { key:'phone',    label:'Phone Number' },
                { key:'email',    label:'Email' },
                { key:'address',  label:'Address' },
                { key:'emergency',label:'Emergency Contact' },
              ].map(field => (
                <div key={field.key}>
                  <label style={lbl}>{field.label}</label>
                  <input type={field.type || 'text'} value={editForm[field.key] || ''}
                    onChange={e => setEditForm(p => ({ ...p, [field.key]: e.target.value }))}
                    style={inp}
                    onFocus={e => { e.target.style.borderColor='#1a73e8'; e.target.style.boxShadow='0 0 0 2px rgba(26,115,232,0.14)'; }}
                    onBlur={e => { e.target.style.borderColor='#e0e0e0'; e.target.style.boxShadow='none'; }}
                  />
                </div>
              ))}
              <div>
                <label style={lbl}>Medical History</label>
                <textarea value={editForm.medicalHistory || ''} onChange={e => setEditForm(p => ({ ...p, medicalHistory: e.target.value }))}
                  rows={3} style={{ ...inp, resize:'vertical', lineHeight:1.5 }}
                  onFocus={e => { e.target.style.borderColor='#1a73e8'; e.target.style.boxShadow='0 0 0 2px rgba(26,115,232,0.14)'; }}
                  onBlur={e => { e.target.style.borderColor='#e0e0e0'; e.target.style.boxShadow='none'; }} />
              </div>
            </div>
            <div style={{ padding:'16px 24px', borderTop:'1px solid #f1f3f4', display:'flex', gap:10 }}>
              <button onClick={() => setEditOpen(false)} style={{ flex:1, background:'#fff', border:'1px solid #e0e0e0', borderRadius:24, padding:'10px', fontSize:13, fontWeight:500, color:'#5f6368', cursor:'pointer' }}>Cancel</button>
              <button onClick={() => { setPatient(editForm); setEditOpen(false); }} style={{ flex:1, background:'#1a73e8', border:'none', borderRadius:24, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
