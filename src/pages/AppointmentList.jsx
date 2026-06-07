import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdArrowBack, MdFilterList, MdEventBusy, MdEditCalendar, MdArrowDropDown, MdClose, MdCheck } from 'react-icons/md';

const APPOINTMENTS = [
  { id:1,  patient:'Alice Johnson',  doctor:'Dr. James Wilson',  spec:'Cardiology',  date:'2026-05-07', time:'09:00', type:'Follow-up',   status:'Completed' },
  { id:2,  patient:'Bob Smith',      doctor:'Dr. James Wilson',  spec:'Cardiology',  date:'2026-05-07', time:'10:30', type:'Consultation', status:'Completed' },
  { id:3,  patient:'Carol Davis',    doctor:'Dr. Sarah Lee',     spec:'Neurology',   date:'2026-05-07', time:'11:00', type:'Consultation', status:'Cancelled' },
  { id:4,  patient:'David Lee',      doctor:'Dr. Priya Sharma',  spec:'Gynecology',  date:'2026-05-08', time:'09:30', type:'Follow-up',   status:'Scheduled' },
  { id:5,  patient:'Emma White',     doctor:'Dr. James Wilson',  spec:'Cardiology',  date:'2026-05-08', time:'10:00', type:'New Patient',  status:'Scheduled' },
  { id:6,  patient:'Frank Harris',   doctor:'Dr. Arjun Mehta',   spec:'Pediatrics',  date:'2026-05-09', time:'09:00', type:'Follow-up',   status:'Scheduled' },
  { id:7,  patient:'Grace Patel',    doctor:'Dr. Neha Kapoor',   spec:'Dermatology', date:'2026-05-09', time:'11:00', type:'Consultation', status:'Scheduled' },
  { id:8,  patient:'Henry Roy',      doctor:'Dr. Sarah Lee',     spec:'Neurology',   date:'2026-05-10', time:'10:00', type:'New Patient',  status:'Scheduled' },
  { id:9,  patient:'Iris Nair',      doctor:'Dr. Robert Chen',   spec:'Cardiology',  date:'2026-05-10', time:'08:00', type:'Follow-up',   status:'Scheduled' },
  { id:10, patient:'Jay Kumar',      doctor:'Dr. Priya Sharma',  spec:'Gynecology',  date:'2026-05-11', time:'09:30', type:'Consultation', status:'Scheduled' },
];

const DOCTORS = [...new Set(APPOINTMENTS.map(a => a.doctor))];

const STATUS_CFG = {
  Scheduled:  { bg:'#e8f0fe', color:'#1a73e8' },
  Completed:  { bg:'#e6f4ea', color:'#1e8e3e' },
  Cancelled:  { bg:'#fce8e6', color:'#d93025' },
  Rescheduled:{ bg:'#fef7e0', color:'#9a6700' },
};

const TYPE_CFG = {
  'Follow-up':   { bg:'#f3e8fd', color:'#7b1fa2' },
  'Consultation':{ bg:'#e8f0fe', color:'#1a73e8' },
  'New Patient': { bg:'#e6f4ea', color:'#1e8e3e' },
};

const SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00'];

export default function AppointmentList() {
  const navigate = useNavigate();
  const [appts, setAppts] = useState(APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newSlot, setNewSlot] = useState('');
  const [newDate, setNewDate] = useState('');

  const filtered = appts.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = a.patient.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q);
    const matchDate   = !filterDate   || a.date === filterDate;
    const matchDoctor = !filterDoctor || a.doctor === filterDoctor;
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchDate && matchDoctor && matchStatus;
  });

  const handleCancel = (id) => {
    setAppts(p => p.map(a => a.id === id ? { ...a, status:'Cancelled' } : a));
    setCancelId(null);
  };

  const handleReschedule = (id) => {
    if (!newDate || !newSlot) return;
    setAppts(p => p.map(a => a.id === id ? { ...a, date:newDate, time:newSlot, status:'Rescheduled' } : a));
    setRescheduleId(null); setNewDate(''); setNewSlot('');
  };

  const clearFilters = () => { setFilterDate(''); setFilterDoctor(''); setFilterStatus(''); setSearch(''); };
  const hasFilters = filterDate || filterDoctor || filterStatus || search;

  const inp = { border:'1px solid #e0e0e0', borderRadius:8, padding:'9px 12px', fontSize:13, color:'#202124', outline:'none', fontFamily:'Inter,sans-serif', background:'#fff', width:'100%', boxSizing:'border-box' };
  const focus = e => { e.target.style.borderColor='#1a73e8'; e.target.style.boxShadow='0 0 0 2px rgba(26,115,232,0.12)'; };
  const blur  = e => { e.target.style.borderColor='#e0e0e0'; e.target.style.boxShadow='none'; };

  const cancelAppt = appts.find(a => a.id === cancelId);
  const rescheduleAppt = appts.find(a => a.id === rescheduleId);

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa', fontFamily:'Inter,sans-serif' }}>

      {/* Nav */}
      <nav style={{ background:'#fff', borderBottom:'1px solid #e0e0e0', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:30, height:30, background:'#1a73e8', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🏥</div>
          <span style={{ fontSize:15, fontWeight:600, color:'#202124' }}>Hospira HMS</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => navigate('/book-appointment')} style={{ background:'#1a73e8', color:'#fff', border:'none', borderRadius:24, padding:'7px 18px', fontSize:13, fontWeight:500, cursor:'pointer' }}>+ Book Appointment</button>
          <button onClick={() => navigate(-1)} style={{ background:'none', border:'1px solid #e0e0e0', borderRadius:24, padding:'7px 16px', fontSize:13, color:'#5f6368', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
            <MdArrowBack style={{ fontSize:15 }} /> Back
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontSize:22, fontWeight:600, color:'#202124', marginBottom:4 }}>Appointments</h1>
          <p style={{ fontSize:13, color:'#9aa0a6' }}>{filtered.length} of {appts.length} appointments shown</p>
        </div>

        {/* Filter bar */}
        <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:12, padding:'16px 20px', marginBottom:16, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <MdFilterList style={{ color:'#9aa0a6', fontSize:20, flexShrink:0 }} />

          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f8f9fa', border:'1px solid #e0e0e0', borderRadius:24, padding:'8px 14px', flex:1, minWidth:180 }}>
            <MdSearch style={{ color:'#9aa0a6', fontSize:16, flexShrink:0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or doctor..."
              style={{ border:'none', outline:'none', background:'transparent', fontSize:13, color:'#202124', width:'100%', fontFamily:'Inter,sans-serif' }} />
          </div>

          {/* Date filter */}
          <div style={{ position:'relative', minWidth:160 }}>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              style={{ ...inp, paddingRight:12 }} onFocus={focus} onBlur={blur} />
          </div>

          {/* Doctor filter */}
          <div style={{ position:'relative', minWidth:200 }}>
            <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}
              style={{ ...inp, appearance:'none', paddingRight:30, cursor:'pointer' }} onFocus={focus} onBlur={blur}>
              <option value="">All Doctors</option>
              {DOCTORS.map(d => <option key={d}>{d}</option>)}
            </select>
            <MdArrowDropDown style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', color:'#9aa0a6', fontSize:20, pointerEvents:'none' }} />
          </div>

          {/* Status filter */}
          <div style={{ position:'relative', minWidth:140 }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ ...inp, appearance:'none', paddingRight:30, cursor:'pointer' }} onFocus={focus} onBlur={blur}>
              <option value="">All Statuses</option>
              {['Scheduled','Completed','Cancelled','Rescheduled'].map(s => <option key={s}>{s}</option>)}
            </select>
            <MdArrowDropDown style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', color:'#9aa0a6', fontSize:20, pointerEvents:'none' }} />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters} style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'1px solid #e0e0e0', borderRadius:24, padding:'8px 14px', fontSize:12, color:'#5f6368', cursor:'pointer', whiteSpace:'nowrap' }}>
              <MdClose style={{ fontSize:14 }} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(60,64,67,0.07)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8f9fa', borderBottom:'1px solid #e0e0e0' }}>
                {['#','Patient Name','Doctor','Specialization','Date','Time','Type','Status','Actions'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'11px 16px', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', color:'#9aa0a6', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:'56px 20px' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
                  <div style={{ fontSize:15, fontWeight:500, color:'#5f6368', marginBottom:4 }}>No appointments found</div>
                  <div style={{ fontSize:13, color:'#9aa0a6' }}>Try changing the filters</div>
                </td></tr>
              ) : filtered.map((a, idx) => {
                const sc = STATUS_CFG[a.status] || STATUS_CFG.Scheduled;
                const tc = TYPE_CFG[a.type]   || TYPE_CFG['Consultation'];
                const canAct = a.status === 'Scheduled' || a.status === 'Rescheduled';
                return (
                  <tr key={a.id} style={{ borderBottom:'1px solid #f1f3f4', transition:'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background='#fff'}>
                    <td style={{ padding:'13px 16px', fontSize:12, color:'#9aa0a6', fontWeight:500 }}>#{a.id}</td>
                    {/* Patient */}
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'#1a73e8', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                          {a.patient.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span style={{ fontSize:13.5, fontWeight:600, color:'#202124' }}>{a.patient}</span>
                      </div>
                    </td>
                    {/* Doctor */}
                    <td style={{ padding:'13px 16px', fontSize:13.5, color:'#202124', fontWeight:500 }}>{a.doctor}</td>
                    {/* Spec */}
                    <td style={{ padding:'13px 16px' }}>
                      <span style={{ background:'#e8f0fe', color:'#1a73e8', fontSize:11, fontWeight:500, padding:'3px 9px', borderRadius:20 }}>{a.spec}</span>
                    </td>
                    {/* Date */}
                    <td style={{ padding:'13px 16px', fontSize:13, color:'#5f6368', whiteSpace:'nowrap' }}>📅 {a.date}</td>
                    {/* Time */}
                    <td style={{ padding:'13px 16px', fontSize:13, color:'#5f6368', whiteSpace:'nowrap' }}>🕐 {a.time}</td>
                    {/* Type */}
                    <td style={{ padding:'13px 16px' }}>
                      <span style={{ background:tc.bg, color:tc.color, fontSize:11, fontWeight:500, padding:'3px 9px', borderRadius:20 }}>{a.type}</span>
                    </td>
                    {/* Status */}
                    <td style={{ padding:'13px 16px' }}>
                      <span style={{ background:sc.bg, color:sc.color, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{a.status}</span>
                    </td>
                    {/* Actions */}
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => canAct && setRescheduleId(a.id)} title="Reschedule"
                          style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:20, border:'1px solid', fontSize:11, fontWeight:500, cursor: canAct ? 'pointer' : 'not-allowed', transition:'all 0.15s', whiteSpace:'nowrap',
                            background: canAct ? '#fff' : '#f8f9fa',
                            color: canAct ? '#1a73e8' : '#bdbdbd',
                            borderColor: canAct ? '#1a73e8' : '#e0e0e0',
                            opacity: canAct ? 1 : 0.5 }}
                          onMouseEnter={e => canAct && (e.currentTarget.style.background='#e8f0fe')}
                          onMouseLeave={e => canAct && (e.currentTarget.style.background='#fff')}>
                          <MdEditCalendar style={{ fontSize:13 }} /> Reschedule
                        </button>
                        <button onClick={() => canAct && setCancelId(a.id)} title="Cancel"
                          style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:20, border:'1px solid', fontSize:11, fontWeight:500, cursor: canAct ? 'pointer' : 'not-allowed', transition:'all 0.15s', whiteSpace:'nowrap',
                            background: canAct ? '#fff' : '#f8f9fa',
                            color: canAct ? '#d93025' : '#bdbdbd',
                            borderColor: canAct ? '#d93025' : '#e0e0e0',
                            opacity: canAct ? 1 : 0.5 }}
                          onMouseEnter={e => canAct && (e.currentTarget.style.background='#fce8e6')}
                          onMouseLeave={e => canAct && (e.currentTarget.style.background='#fff')}>
                          <MdEventBusy style={{ fontSize:13 }} /> Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <p style={{ textAlign:'center', fontSize:12, color:'#9aa0a6', marginTop:14 }}>
            Showing {filtered.length} of {appts.length} appointments
          </p>
        )}
      </div>

      {/* ── Cancel Dialog ── */}
      {cancelId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(32,33,36,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:'32px', maxWidth:380, width:'100%', boxShadow:'0 8px 24px rgba(60,64,67,0.18)', textAlign:'center' }}>
            <div style={{ width:56, height:56, background:'#fce8e6', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:24 }}>
              <MdEventBusy style={{ color:'#d93025', fontSize:28 }} />
            </div>
            <h3 style={{ fontSize:17, fontWeight:600, color:'#202124', marginBottom:8 }}>Cancel Appointment</h3>
            <p style={{ fontSize:13, color:'#5f6368', lineHeight:1.6, marginBottom:24 }}>
              Cancel appointment for <strong>{cancelAppt?.patient}</strong> with <strong>{cancelAppt?.doctor}</strong> on {cancelAppt?.date} at {cancelAppt?.time}?
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setCancelId(null)} style={{ flex:1, background:'#fff', border:'1px solid #e0e0e0', borderRadius:24, padding:'10px', fontSize:13, fontWeight:500, color:'#5f6368', cursor:'pointer' }}>Keep it</button>
              <button onClick={() => handleCancel(cancelId)} style={{ flex:1, background:'#d93025', border:'none', borderRadius:24, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor:'pointer' }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reschedule Dialog ── */}
      {rescheduleId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(32,33,36,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:420, boxShadow:'0 8px 24px rgba(60,64,67,0.18)' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f3f4', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ fontSize:16, fontWeight:600, color:'#202124' }}>Reschedule Appointment</h3>
              <button onClick={() => { setRescheduleId(null); setNewDate(''); setNewSlot(''); }} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9aa0a6' }}>✕</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'#f8f9fa', borderRadius:10, padding:'12px 14px', fontSize:13, color:'#5f6368' }}>
                📋 <strong>{rescheduleAppt?.patient}</strong> · {rescheduleAppt?.doctor} · Current: {rescheduleAppt?.date} {rescheduleAppt?.time}
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:500, color:'#5f6368', display:'block', marginBottom:5 }}>New Date *</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                  style={{ ...inp }} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:500, color:'#5f6368', display:'block', marginBottom:5 }}>New Time Slot *</label>
                <div style={{ position:'relative' }}>
                  <select value={newSlot} onChange={e => setNewSlot(e.target.value)} style={{ ...inp, appearance:'none', paddingRight:30, cursor:'pointer' }} onFocus={focus} onBlur={blur}>
                    <option value="">Select slot...</option>
                    {SLOTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <MdArrowDropDown style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', color:'#9aa0a6', fontSize:20, pointerEvents:'none' }} />
                </div>
              </div>
            </div>
            <div style={{ padding:'16px 24px', borderTop:'1px solid #f1f3f4', display:'flex', gap:10 }}>
              <button onClick={() => { setRescheduleId(null); setNewDate(''); setNewSlot(''); }} style={{ flex:1, background:'#fff', border:'1px solid #e0e0e0', borderRadius:24, padding:'10px', fontSize:13, color:'#5f6368', cursor:'pointer' }}>Cancel</button>
              <button onClick={() => handleReschedule(rescheduleId)} disabled={!newDate || !newSlot}
                style={{ flex:1, background: (!newDate || !newSlot) ? '#9aa0a6' : '#1a73e8', border:'none', borderRadius:24, padding:'10px', fontSize:13, fontWeight:600, color:'#fff', cursor: (!newDate || !newSlot) ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <MdCheck style={{ fontSize:16 }} /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
