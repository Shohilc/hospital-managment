import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdArrowDropDown, MdCalendarToday, MdAccessTime, MdPerson, MdCheck } from 'react-icons/md';

// ── Sample data ──────────────────────────────────────────────
const DOCTORS = [
  { id: 1, name: 'Dr. James Wilson',  spec: 'Cardiology',   qual: 'MD, DM', fee: 800,  days: ['Mon','Tue','Wed','Thu','Fri'], slots: ['09:00','09:45','10:30','11:15','14:00','14:45','15:30'] },
  { id: 2, name: 'Dr. Sarah Lee',     spec: 'Neurology',    qual: 'DM',     fee: 1000, days: ['Mon','Wed','Fri'],             slots: ['10:00','10:45','11:30','14:00','15:00','16:00'] },
  { id: 3, name: 'Dr. Priya Sharma',  spec: 'Gynecology',   qual: 'MS',     fee: 600,  days: ['Mon','Tue','Thu','Sat'],        slots: ['08:00','08:45','09:30','10:15','11:00','12:00'] },
  { id: 4, name: 'Dr. Arjun Mehta',   spec: 'Pediatrics',   qual: 'MD',     fee: 500,  days: ['Tue','Wed','Thu','Fri'],        slots: ['09:00','09:30','10:00','10:30','11:00','14:00','15:00'] },
  { id: 5, name: 'Dr. Neha Kapoor',   spec: 'Dermatology',  qual: 'MD',     fee: 650,  days: ['Wed','Thu','Fri','Sat'],        slots: ['11:00','11:45','12:30','14:00','15:00','16:00','17:00'] },
  { id: 6, name: 'Dr. Robert Chen',   spec: 'Cardiology',   qual: 'DM',     fee: 1200, days: ['Mon','Tue','Wed'],             slots: ['08:00','08:45','09:30','10:15','11:00','12:00'] },
];

// already booked slots per doctor per date (simulation)
const BOOKED = {
  1: { '2026-05-08': ['09:00','11:15'], '2026-05-09': ['14:00'] },
  2: { '2026-05-08': ['10:00','14:00'] },
  3: { '2026-05-10': ['08:00','09:30'] },
};

const LOGGED_IN_PATIENT = 'Alice Johnson'; // simulated logged-in user

const DAY_MAP = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const inp = {
  width: '100%', padding: '11px 12px 11px 40px',
  border: '1px solid #e0e0e0', borderRadius: 8,
  fontSize: 14, color: '#202124', outline: 'none',
  fontFamily: 'Inter, sans-serif', background: '#fff',
  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
};
const iconBox = {
  position: 'absolute', left: 12, top: '50%',
  transform: 'translateY(-50%)', color: '#9aa0a6',
  fontSize: 18, display: 'flex', alignItems: 'center', pointerEvents: 'none',
};
const focusIn  = e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; };
const blurIn   = e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; };
const lbl = (text, req) => (
  <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 6 }}>
    {text}{req && <span style={{ color: '#d93025', marginLeft: 2 }}>*</span>}
  </label>
);
const errMsg = (msg) => msg ? <span style={{ fontSize: 11, color: '#d93025', marginTop: 3, display: 'block' }}>⚠ {msg}</span> : null;

// ─────────────────────────────────────────────────────────────
export default function BookAppointment() {
  const navigate = useNavigate();
  const [booked, setBooked] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    doctorId: '',
    date: '',
    slot: '',
    reason: '',
    type: 'Consultation',
  });

  const selectedDoctor = DOCTORS.find(d => d.id === +form.doctorId) || null;

  // derive day name from selected date
  const selectedDayName = form.date
    ? DAY_MAP[new Date(form.date + 'T00:00:00').getDay()]
    : null;

  // is this date valid for selected doctor
  const dateValid = selectedDoctor && selectedDayName
    ? selectedDoctor.days.includes(selectedDayName)
    : true;

  // available slots = doctor slots minus booked
  const bookedForDay = (selectedDoctor && form.date)
    ? (BOOKED[selectedDoctor.id]?.[form.date] || [])
    : [];
  const availableSlots = selectedDoctor
    ? selectedDoctor.slots.filter(s => !bookedForDay.includes(s))
    : [];

  // reset slot when doctor or date changes
  useEffect(() => { setForm(p => ({ ...p, slot: '' })); }, [form.doctorId, form.date]);

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.doctorId) e.doctorId = 'Please select a doctor';
    if (!form.date) e.date = 'Please select a date';
    else if (!dateValid) e.date = `${selectedDoctor?.name} is not available on ${selectedDayName}s. Available: ${selectedDoctor?.days.join(', ')}`;
    if (!form.slot) e.slot = 'Please select a time slot';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setBooked(true);
  };

  // today's date for min
  const today = new Date().toISOString().split('T')[0];

  // ── Success ──
  if (booked) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20, padding: '48px 40px', textAlign: 'center', maxWidth: 440, width: '100%', boxShadow: '0 4px 16px rgba(60,64,67,0.1)' }}>
          <div style={{ width: 72, height: 72, background: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 10 }}>Appointment Booked!</h2>

          {/* Booking summary */}
          <div style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 12, padding: '18px 20px', textAlign: 'left', marginBottom: 24 }}>
            {[
              { label: 'Patient',  value: LOGGED_IN_PATIENT },
              { label: 'Doctor',   value: selectedDoctor?.name },
              { label: 'Specialty',value: selectedDoctor?.spec },
              { label: 'Date',     value: form.date },
              { label: 'Time',     value: form.slot },
              { label: 'Type',     value: form.type },
              { label: 'Fee',      value: `₹${selectedDoctor?.fee?.toLocaleString()}` },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 6 ? '1px solid #f1f3f4' : 'none' }}>
                <span style={{ fontSize: 12, color: '#9aa0a6', fontWeight: 500 }}>{r.label}</span>
                <span style={{ fontSize: 13, color: '#202124', fontWeight: 600 }}>{r.value}</span>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/patient-profile')}
            style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginBottom: 10 }}>
            View My Profile
          </button>
          <button onClick={() => { setBooked(false); setForm({ doctorId:'', date:'', slot:'', reason:'', type:'Consultation' }); }}
            style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer' }}>
            Book another appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 30, height: 30, background: '#1a73e8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>MediCore HMS</span>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <MdArrowBack style={{ fontSize: 16 }} /> Back
        </button>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '36px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: 580 }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px', color: '#1a73e8' }}>
              <MdCalendarToday />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#202124', marginBottom: 6 }}>Book an Appointment</h1>
            <p style={{ fontSize: 13, color: '#9aa0a6' }}>Select a doctor and preferred time slot to confirm your visit</p>
          </div>

          <form onSubmit={handleSubmit} noValidate
            style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(60,64,67,0.08)', display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* ── Patient Name (auto-filled, read-only) ── */}
            <div>
              {lbl('Patient Name')}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdPerson /></span>
                <input readOnly value={LOGGED_IN_PATIENT}
                  style={{ ...inp, background: '#f8f9fa', color: '#5f6368', cursor: 'not-allowed' }} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#1e8e3e', fontWeight: 500, background: '#e6f4ea', padding: '2px 8px', borderRadius: 20 }}>
                  Auto-filled
                </span>
              </div>
            </div>

            {/* ── Select Doctor ── */}
            <div>
              {lbl('Select Doctor', true)}
              <div style={{ position: 'relative' }}>
                <select value={form.doctorId} onChange={e => f('doctorId', e.target.value)}
                  style={{ ...inp, paddingLeft: 12, paddingRight: 36, appearance: 'none', ...(errors.doctorId ? { borderColor:'#d93025', background:'#fffafa' } : {}) }}
                  onFocus={focusIn} onBlur={blurIn}>
                  <option value="">Choose a doctor...</option>
                  {DOCTORS.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.spec} (₹{d.fee})</option>
                  ))}
                </select>
                <MdArrowDropDown style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#9aa0a6', fontSize:22, pointerEvents:'none' }} />
              </div>
              {errMsg(errors.doctorId)}
            </div>

            {/* ── Specialization (auto-fill) ── */}
            {selectedDoctor && (
              <div style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 12, padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Specialization', value: selectedDoctor.spec },
                  { label: 'Qualification',  value: selectedDoctor.qual },
                  { label: 'Consult Fee',     value: `₹${selectedDoctor.fee.toLocaleString()}` },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a73e8' }}>{item.value}</div>
                  </div>
                ))}
                <div style={{ gridColumn: 'span 3' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Available Days</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                      <span key={day} style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                        background: selectedDoctor.days.includes(day) ? '#e8f0fe' : '#f1f3f4',
                        color: selectedDoctor.days.includes(day) ? '#1a73e8' : '#bdbdbd' }}>
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Date picker ── */}
            <div>
              {lbl('Appointment Date', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdCalendarToday /></span>
                <input type="date" value={form.date} min={today}
                  onChange={e => f('date', e.target.value)}
                  style={{ ...inp, ...(errors.date ? { borderColor:'#d93025', background:'#fffafa' } : {}) }}
                  onFocus={focusIn} onBlur={blurIn} />
              </div>
              {/* day-not-available warning */}
              {form.date && selectedDoctor && !dateValid && (
                <div style={{ marginTop:6, background:'#fef7e0', border:'1px solid #fdd7a0', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#9a6700' }}>
                  ⚠ {selectedDoctor.name} is not available on <strong>{selectedDayName}s</strong>. Please pick a date that falls on: <strong>{selectedDoctor.days.join(', ')}</strong>.
                </div>
              )}
              {errMsg(errors.date)}
            </div>

            {/* ── Available Slot dropdown ── */}
            <div>
              {lbl('Available Time Slot', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdAccessTime /></span>
                <select value={form.slot} onChange={e => f('slot', e.target.value)}
                  disabled={!selectedDoctor || !form.date || !dateValid}
                  style={{ ...inp, paddingRight: 36, appearance: 'none',
                    opacity: (!selectedDoctor || !form.date || !dateValid) ? 0.5 : 1,
                    cursor: (!selectedDoctor || !form.date || !dateValid) ? 'not-allowed' : 'pointer',
                    ...(errors.slot ? { borderColor:'#d93025', background:'#fffafa' } : {}),
                  }}
                  onFocus={focusIn} onBlur={blurIn}>
                  <option value="">
                    {!selectedDoctor ? 'Select a doctor first' : !form.date ? 'Select a date first' : !dateValid ? 'Doctor not available' : availableSlots.length === 0 ? 'No slots available' : 'Choose a time slot...'}
                  </option>
                  {availableSlots.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <MdArrowDropDown style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:'#9aa0a6', fontSize:22, pointerEvents:'none' }} />
              </div>
              {/* Slot count info */}
              {selectedDoctor && form.date && dateValid && (
                <div style={{ marginTop:5, fontSize:11, color:'#9aa0a6' }}>
                  {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''} available
                  {bookedForDay.length > 0 && ` · ${bookedForDay.length} already booked`}
                </div>
              )}
              {errMsg(errors.slot)}
            </div>

            {/* ── Appointment Type ── */}
            <div>
              {lbl('Appointment Type')}
              <div style={{ display: 'flex', gap: 10 }}>
                {['Consultation', 'Follow-up', 'Emergency'].map(t => (
                  <label key={t} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${form.type === t ? '#1a73e8' : '#e0e0e0'}`,
                    background: form.type === t ? '#e8f0fe' : '#fff',
                    color: form.type === t ? '#1a73e8' : '#5f6368',
                    fontWeight: form.type === t ? 600 : 400, fontSize: 13,
                    transition: 'all 0.15s', userSelect: 'none',
                  }}>
                    <input type="radio" name="apptType" value={t} checked={form.type === t}
                      onChange={e => f('type', e.target.value)}
                      style={{ accentColor: '#1a73e8', width: 14, height: 14 }} />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Reason (optional) ── */}
            <div>
              {lbl('Reason for Visit')}
              <textarea value={form.reason} onChange={e => f('reason', e.target.value)}
                placeholder="Describe your symptoms or reason for appointment (optional)..."
                rows={3}
                style={{ width:'100%', padding:'11px 12px', border:'1px solid #e0e0e0', borderRadius:8, fontSize:14, color:'#202124', outline:'none', fontFamily:'Inter,sans-serif', boxSizing:'border-box', resize:'none', lineHeight:1.5, transition:'border-color 0.15s, box-shadow 0.15s' }}
                onFocus={focusIn} onBlur={blurIn} />
            </div>

            {/* ── Fee summary ── */}
            {selectedDoctor && (
              <div style={{ background:'#f8f9fa', borderRadius:10, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #e0e0e0' }}>
                <span style={{ fontSize:13, color:'#5f6368' }}>Consultation Fee</span>
                <span style={{ fontSize:16, fontWeight:700, color:'#1e8e3e' }}>₹{selectedDoctor.fee.toLocaleString()}</span>
              </div>
            )}

            {/* ── Book Button ── */}
            <button type="submit" id="book-appointment-btn"
              style={{ background:'#1a73e8', color:'#fff', border:'none', borderRadius:24, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', width:'100%', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
              onMouseEnter={e => e.currentTarget.style.background='#1557b0'}
              onMouseLeave={e => e.currentTarget.style.background='#1a73e8'}>
              <MdCalendarToday style={{ fontSize:18 }} /> Book Appointment
            </button>

            <p style={{ textAlign:'center', fontSize:13, color:'#9aa0a6', marginTop:-8 }}>
              Need help?{' '}
              <span onClick={() => navigate('/doctors')} style={{ color:'#1a73e8', fontWeight:500, cursor:'pointer' }}>
                Browse all doctors
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
