import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdCalendarToday, MdPeople, MdAccessTime, MdMedicalServices,
  MdArrowDropDown, MdSearch, MdNotifications, MdCheck,
  MdSchedule, MdMoreVert, MdAdd, MdPrint
} from 'react-icons/md';

// ── Sample Data ──
const DOCTOR = { name: 'Dr. James Wilson', spec: 'Cardiology', qual: 'MD, DM', avatar: 'JW' };

const TODAY_APPTS = [
  { id: 1, time: '09:00', patient: 'Alice Johnson', age: 34, type: 'Follow-up',     reason: 'Chest pain review',       status: 'Completed' },
  { id: 2, time: '09:45', patient: 'Bob Smith',     age: 52, type: 'Consultation',  reason: 'Blood pressure check',    status: 'Completed' },
  { id: 3, time: '10:30', patient: 'Carol Davis',   age: 28, type: 'New Patient',   reason: 'Palpitations',            status: 'In Progress' },
  { id: 4, time: '11:15', patient: 'David Lee',     age: 67, type: 'Follow-up',     reason: 'Post-surgery checkup',    status: 'Waiting' },
  { id: 5, time: '12:00', patient: 'Emma White',    age: 45, type: 'Consultation',  reason: 'ECG interpretation',      status: 'Waiting' },
  { id: 6, time: '14:00', patient: 'Frank Harris',  age: 58, type: 'Follow-up',     reason: 'Medication adjustment',   status: 'Scheduled' },
  { id: 7, time: '15:00', patient: 'Grace Patel',   age: 39, type: 'New Patient',   reason: 'Breathlessness',          status: 'Scheduled' },
];

const UPCOMING = [
  { date: 'Thu, 8 May', time: '09:30', patient: 'Henry Roy',   type: 'Follow-up',    reason: 'Echo result review' },
  { date: 'Thu, 8 May', time: '11:00', patient: 'Iris Nair',   type: 'Consultation', reason: 'Chest X-ray discussion' },
  { date: 'Fri, 9 May', time: '10:00', patient: 'Jay Kumar',   type: 'New Patient',  reason: 'Referral from GP' },
  { date: 'Fri, 9 May', time: '14:00', patient: 'Karen Singh', type: 'Follow-up',    reason: 'Stent follow-up' },
  { date: 'Sat, 10 May',time: '09:00', patient: 'Leo Mathew',  type: 'Consultation', reason: 'Irregular heartbeat' },
];

const PRESCRIPTIONS = [
  { patient: 'Alice Johnson', date: 'Today 09:00', medicines: ['Aspirin 75mg · 1×daily', 'Atorvastatin 20mg · 1×night'], notes: 'Continue for 3 months, review BP weekly.' },
  { patient: 'Bob Smith',     date: 'Today 09:45', medicines: ['Amlodipine 5mg · 1×morning', 'Losartan 50mg · 1×evening'], notes: 'Reduce salt intake. Follow-up in 4 weeks.' },
  { patient: 'Carol Davis',   date: 'Today 10:30', medicines: ['Metoprolol 25mg · 2×daily'], notes: 'Monitor pulse. Return if symptoms worsen.' },
];

const STATUS_CFG = {
  Completed:    { bg: '#e6f4ea', color: '#1e8e3e', dot: '#1e8e3e' },
  'In Progress':{ bg: '#e8f0fe', color: '#1a73e8', dot: '#1a73e8' },
  Waiting:      { bg: '#fef7e0', color: '#9a6700', dot: '#f29900' },
  Scheduled:    { bg: '#f1f3f4', color: '#5f6368', dot: '#9aa0a6' },
};

const TYPE_CFG = {
  'Follow-up':   { bg: '#f3e8fd', color: '#7b1fa2' },
  'Consultation':{ bg: '#e8f0fe', color: '#1a73e8' },
  'New Patient': { bg: '#e6f4ea', color: '#1e8e3e' },
};

const AVATAR_COLORS = ['#1a73e8','#1e8e3e','#7b1fa2','#f29900','#d93025','#00897b','#5e35b1'];
const av = (name) => name.split(' ').slice(-2).map(n => n[0]).join('');

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [prescModal, setPrescModal] = useState(null);
  const [searchQ, setSearchQ] = useState('');

  const completed  = TODAY_APPTS.filter(a => a.status === 'Completed').length;
  const waiting    = TODAY_APPTS.filter(a => a.status === 'Waiting' || a.status === 'In Progress').length;
  const scheduled  = TODAY_APPTS.filter(a => a.status === 'Scheduled').length;
  const totalPatients = 124;

  const filteredAppts = TODAY_APPTS.filter(a =>
    a.patient.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.reason.toLowerCase().includes(searchQ.toLowerCase())
  );

  const stats = [
    { label: "Today's Appointments", value: TODAY_APPTS.length, icon: '📅', color: '#1a73e8', bg: '#e8f0fe', sub: `${completed} done · ${waiting} waiting` },
    { label: 'Total Patients',        value: totalPatients,      icon: '👥', color: '#1e8e3e', bg: '#e6f4ea', sub: '+3 this week' },
    { label: 'Completed Today',       value: completed,          icon: '✅', color: '#1e8e3e', bg: '#e6f4ea', sub: 'Out of ' + TODAY_APPTS.length },
    { label: 'Upcoming (next 7 days)',value: UPCOMING.length,    icon: '🗓️', color: '#7b1fa2', bg: '#f3e8fd', sub: '2 new patients' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Bar ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, background: '#1a73e8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>MediCore HMS</span>
          <span style={{ fontSize: 12, color: '#9aa0a6', marginLeft: 6, background: '#f1f3f4', padding: '3px 10px', borderRadius: 20 }}>Doctor Portal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* date */}
          <span style={{ fontSize: 12, color: '#9aa0a6' }}>📅 Thursday, 8 May 2026</span>
          {/* notification */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <MdNotifications style={{ fontSize: 22, color: '#5f6368' }} />
            <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#d93025', borderRadius: '50%', border: '1.5px solid #fff' }} />
          </div>
          {/* doctor chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8f9fa', borderRadius: 24, padding: '5px 12px 5px 6px', cursor: 'pointer', border: '1px solid #e0e0e0' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a73e8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{DOCTOR.avatar}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#202124', lineHeight: 1.2 }}>{DOCTOR.name}</div>
              <div style={{ fontSize: 10, color: '#9aa0a6' }}>{DOCTOR.spec}</div>
            </div>
            <MdArrowDropDown style={{ color: '#9aa0a6', fontSize: 18 }} />
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Welcome ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 3 }}>Good morning, {DOCTOR.name} 👋</h1>
            <p style={{ fontSize: 13, color: '#9aa0a6' }}>You have <strong style={{ color: '#1a73e8' }}>{waiting}</strong> patients waiting and <strong style={{ color: '#1e8e3e' }}>{scheduled}</strong> appointments later today.</p>
          </div>
          <button onClick={() => navigate('/register/doctor')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '9px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <MdAdd /> New Prescription
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow 0.15s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(60,64,67,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#5f6368', margin: '3px 0 2px', fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#9aa0a6' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

          {/* ── Left: Appointments ── */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 14, overflow: 'hidden' }}>
            {/* Tab header */}
            <div style={{ padding: '16px 20px 0', borderBottom: '1px solid #f1f3f4' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>Appointments</h2>
                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 20, padding: '6px 12px' }}>
                  <MdSearch style={{ color: '#9aa0a6', fontSize: 15 }} />
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search patient..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12.5, color: '#202124', width: 130, fontFamily: 'Inter, sans-serif' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 0 }}>
                {[{ key:'today', label:"Today's" },{ key:'upcoming', label:'Upcoming' }].map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '8px 18px', fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? '#1a73e8' : '#9aa0a6', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t.key ? '#1a73e8' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment rows */}
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {(activeTab === 'today' ? filteredAppts : UPCOMING).map((a, idx) => {
                if (activeTab === 'today') {
                  const sc = STATUS_CFG[a.status] || STATUS_CFG.Scheduled;
                  const tc = TYPE_CFG[a.type] || TYPE_CFG['Consultation'];
                  return (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: '1px solid #f1f3f4', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      {/* Time */}
                      <div style={{ width: 48, flexShrink: 0, textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#202124' }}>{a.time}</div>
                      </div>
                      {/* Avatar */}
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: AVATAR_COLORS[idx % AVATAR_COLORS.length], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{av(a.patient)}</div>
                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: '#202124' }}>{a.patient}</span>
                          <span style={{ fontSize: 11, color: '#9aa0a6' }}>· {a.age}y</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 2 }}>{a.reason}</div>
                      </div>
                      {/* Type badge */}
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: tc.bg, color: tc.color, whiteSpace: 'nowrap' }}>{a.type}</span>
                      {/* Status badge */}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: sc.bg, color: sc.color, whiteSpace: 'nowrap' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot }} />{a.status}
                      </span>
                    </div>
                  );
                } else {
                  // Upcoming tab
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: '1px solid #f1f3f4', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: AVATAR_COLORS[idx % AVATAR_COLORS.length], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{av(a.patient)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#202124' }}>{a.patient}</div>
                        <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 2 }}>{a.reason}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#5f6368' }}>{a.date}</div>
                        <div style={{ fontSize: 11, color: '#9aa0a6', marginTop: 2 }}>{a.time}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: TYPE_CFG[a.type]?.bg || '#f1f3f4', color: TYPE_CFG[a.type]?.color || '#5f6368', whiteSpace: 'nowrap' }}>{a.type}</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* ── Right: Prescriptions ── */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>Prescriptions</h2>
              <span style={{ fontSize: 11, color: '#9aa0a6' }}>Today</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
              {PRESCRIPTIONS.map((p, i) => (
                <div key={i} style={{ padding: '14px 20px', borderBottom: i < PRESCRIPTIONS.length - 1 ? '1px solid #f1f3f4' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#202124' }}>{p.patient}</div>
                      <div style={{ fontSize: 11, color: '#9aa0a6', marginTop: 1 }}>{p.date}</div>
                    </div>
                    <button onClick={() => setPrescModal(p)} title="View & Print" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: '#5f6368', cursor: 'pointer' }}>
                      <MdPrint style={{ fontSize: 13 }} /> Print
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {p.medicines.map((m, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5f6368' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a73e8', flexShrink: 0 }} />
                        {m}
                      </div>
                    ))}
                  </div>
                  {p.notes && (
                    <div style={{ marginTop: 8, background: '#f8f9fa', borderRadius: 8, padding: '8px 10px', fontSize: 11.5, color: '#5f6368', lineHeight: 1.5 }}>
                      📝 {p.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Patient Count detail strip ── */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 14, padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { label: 'New Patients (month)', value: 14, icon: '🆕', color: '#1a73e8' },
            { label: 'Follow-ups (month)',   value: 38, icon: '🔄', color: '#7b1fa2' },
            { label: 'Avg Consultation Time',value: '18 min', icon: '⏱️', color: '#f29900' },
            { label: 'Patient Satisfaction', value: '4.8 / 5', icon: '⭐', color: '#1e8e3e' },
          ].map((s, i, arr) => (
            <div key={i} style={{ textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid #f1f3f4' : 'none', padding: '0 20px' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Prescription Modal ── */}
      {prescModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(32,33,36,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, boxShadow: '0 8px 24px rgba(60,64,67,0.18)' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f3f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#202124' }}>Prescription</h3>
                <p style={{ fontSize: 12, color: '#9aa0a6', marginTop: 2 }}>{prescModal.date}</p>
              </div>
              <button onClick={() => setPrescModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9aa0a6', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {/* Body */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#9aa0a6', marginBottom: 2 }}>PATIENT</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#202124' }}>{prescModal.patient}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#9aa0a6', marginBottom: 2 }}>DOCTOR</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#202124' }}>{DOCTOR.name}</div>
                  <div style={{ fontSize: 11, color: '#9aa0a6' }}>{DOCTOR.spec}</div>
                </div>
              </div>
              <div style={{ background: '#f8f9fa', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9aa0a6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medicines</div>
                {prescModal.medicines.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < prescModal.medicines.length - 1 ? 8 : 0 }}>
                    <span style={{ width: 22, height: 22, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>💊</span>
                    <span style={{ fontSize: 13, color: '#202124' }}>{m}</span>
                  </div>
                ))}
              </div>
              {prescModal.notes && (
                <div style={{ background: '#fef7e0', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#9a6700', lineHeight: 1.6 }}>
                  📝 <strong>Notes:</strong> {prescModal.notes}
                </div>
              )}
            </div>
            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f3f4', display: 'flex', gap: 10 }}>
              <button onClick={() => setPrescModal(null)} style={{ flex: 1, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 24, padding: '10px', fontSize: 13, fontWeight: 500, color: '#5f6368', cursor: 'pointer' }}>Close</button>
              <button onClick={() => window.print()} style={{ flex: 1, background: '#1a73e8', border: 'none', borderRadius: 24, padding: '10px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <MdPrint /> Print Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
