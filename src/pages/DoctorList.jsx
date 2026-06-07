import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdEdit, MdDelete, MdArrowBack, MdFilterList, MdPerson } from 'react-icons/md';

const SPECIALIZATIONS = ['All', 'Cardiology', 'Neurology', 'Gynecology', 'Pediatrics', 'Dermatology'];

// Sample doctor data (in production this comes from SQL DB)
const SAMPLE_DOCTORS = [
  { id: 1, name: 'Dr. James Wilson',  specialization: 'Cardiology',   qualification: 'MD', experience: 12, fee: 800,  days: ['Mon','Tue','Wed','Thu','Fri'], timeFrom: '09:00', timeTo: '17:00', status: 'Available' },
  { id: 2, name: 'Dr. Sarah Lee',     specialization: 'Neurology',    qualification: 'DM', experience: 9,  fee: 1000, days: ['Mon','Wed','Fri'],             timeFrom: '10:00', timeTo: '16:00', status: 'Available' },
  { id: 3, name: 'Dr. Priya Sharma',  specialization: 'Gynecology',   qualification: 'MS', experience: 7,  fee: 600,  days: ['Mon','Tue','Thu','Sat'],        timeFrom: '08:00', timeTo: '14:00', status: 'Available' },
  { id: 4, name: 'Dr. Arjun Mehta',   specialization: 'Pediatrics',   qualification: 'MD', experience: 5,  fee: 500,  days: ['Tue','Wed','Thu','Fri'],        timeFrom: '09:00', timeTo: '15:00', status: 'On Leave'  },
  { id: 5, name: 'Dr. Neha Kapoor',   specialization: 'Dermatology',  qualification: 'MD', experience: 6,  fee: 650,  days: ['Wed','Thu','Fri','Sat'],        timeFrom: '11:00', timeTo: '18:00', status: 'Available' },
  { id: 6, name: 'Dr. Robert Chen',   specialization: 'Cardiology',   qualification: 'DM', experience: 15, fee: 1200, days: ['Mon','Tue','Wed'],             timeFrom: '08:00', timeTo: '13:00', status: 'Available' },
  { id: 7, name: 'Dr. Fatima Khan',   specialization: 'Neurology',    qualification: 'MD', experience: 8,  fee: 900,  days: ['Mon','Thu','Fri'],             timeFrom: '10:00', timeTo: '17:00', status: 'Unavailable'},
  { id: 8, name: 'Dr. Meera Iyer',    specialization: 'Gynecology',   qualification: 'MS', experience: 11, fee: 750,  days: ['Tue','Wed','Sat'],             timeFrom: '09:00', timeTo: '14:00', status: 'Available' },
];

const STATUS_STYLE = {
  Available:   { bg: '#e6f4ea', color: '#1e8e3e', dot: '#1e8e3e' },
  'On Leave':  { bg: '#fef7e0', color: '#9a6700', dot: '#f29900' },
  Unavailable: { bg: '#fce8e6', color: '#c5221f', dot: '#d93025' },
};

const AVATAR_COLORS = ['#1a73e8','#1e8e3e','#7b1fa2','#f29900','#d93025','#00897b','#5e35b1','#e91e63'];

export default function DoctorList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(SAMPLE_DOCTORS);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  // Filter logic
  const filtered = doctors.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specFilter === 'All' || d.specialization === specFilter;
    return matchSearch && matchSpec;
  });

  const handleDelete = (id) => {
    setDoctors(p => p.filter(d => d.id !== id));
    setDeleteId(null);
  };

  const initials = (name) => name.split(' ').filter(n => n.startsWith('Dr.') ? false : true).slice(0,2).map(n => n[0]).join('');

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 30, height: 30, background: '#1a73e8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>Hospira HMS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/register/doctor')} style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '7px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            + Add Doctor
          </button>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: '1px solid #e0e0e0', borderRadius: 24, padding: '7px 18px', fontSize: 13, color: '#5f6368', cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#202124', marginBottom: 4 }}>Our Doctors</h1>
          <p style={{ fontSize: 13, color: '#9aa0a6' }}>{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* ── Search + Filter bar ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 24, padding: '9px 16px', flex: 1, minWidth: 220, maxWidth: 360, transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = '#1a73e8'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.12)'; }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <MdSearch style={{ color: '#9aa0a6', fontSize: 18, flexShrink: 0 }} />
            <input
              id="doctor-search"
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13.5, color: '#202124', width: '100%', fontFamily: 'Inter, sans-serif' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9aa0a6', fontSize: 16, padding: 0, display: 'flex', alignItems: 'center' }}>✕</button>
            )}
          </div>

          {/* Specialization filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <MdFilterList style={{ color: '#9aa0a6', fontSize: 18 }} />
            {SPECIALIZATIONS.map(s => (
              <button key={s} onClick={() => setSpecFilter(s)}
                style={{ padding: '7px 16px', borderRadius: 24, border: '1px solid', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                  background: specFilter === s ? '#1a73e8' : '#fff',
                  color: specFilter === s ? '#fff' : '#5f6368',
                  borderColor: specFilter === s ? '#1a73e8' : '#e0e0e0',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(60,64,67,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                {['Doctor', 'Specialization', 'Consultation Fee', 'Available Days', 'Timing', 'Availability', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9aa0a6', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '60px 20px', color: '#9aa0a6' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#5f6368', marginBottom: 6 }}>No doctors found</div>
                    <div style={{ fontSize: 13 }}>Try a different name or specialization</div>
                  </td>
                </tr>
              ) : (
                filtered.map((d, idx) => {
                  const avatarColor = AVATAR_COLORS[d.id % AVATAR_COLORS.length];
                  const s = STATUS_STYLE[d.status] || STATUS_STYLE.Available;
                  return (
                    <tr key={d.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f3f4' : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      {/* Doctor name + avatar */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {initials(d.name) || <MdPerson />}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#202124' }}>{d.name}</div>
                            <div style={{ fontSize: 11, color: '#9aa0a6', marginTop: 1 }}>{d.qualification} · {d.experience} yrs exp</div>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#e8f0fe', color: '#1a73e8', fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 20 }}>
                          {d.specialization}
                        </span>
                      </td>

                      {/* Fee */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1e8e3e' }}>₹{d.fee.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: '#9aa0a6', marginLeft: 4 }}>/ visit</span>
                      </td>

                      {/* Available Days */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
                            <span key={day} style={{
                              fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                              background: d.days.includes(day) ? '#e8f0fe' : '#f1f3f4',
                              color: d.days.includes(day) ? '#1a73e8' : '#bdbdbd',
                            }}>{day}</span>
                          ))}
                        </div>
                      </td>

                      {/* Timing */}
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#5f6368', whiteSpace: 'nowrap' }}>
                        🕐 {d.timeFrom} – {d.timeTo}
                      </td>

                      {/* Availability */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                          {d.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => navigate(`/register/doctor?edit=${d.id}`)}
                            title="Edit"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#5f6368', cursor: 'pointer', fontSize: 16, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#e8f0fe'; e.currentTarget.style.color = '#1a73e8'; e.currentTarget.style.borderColor = '#1a73e8'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#5f6368'; e.currentTarget.style.borderColor = '#e0e0e0'; }}
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => setDeleteId(d.id)}
                            title="Delete"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#5f6368', cursor: 'pointer', fontSize: 16, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fce8e6'; e.currentTarget.style.color = '#d93025'; e.currentTarget.style.borderColor = '#d93025'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#5f6368'; e.currentTarget.style.borderColor = '#e0e0e0'; }}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Summary ── */}
        {filtered.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9aa0a6', marginTop: 16 }}>
            Showing {filtered.length} of {doctors.length} doctors
          </p>
        )}
      </div>

      {/* ── Delete Confirm Dialog ── */}
      {deleteId && (() => {
        const doc = doctors.find(d => d.id === deleteId);
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(32,33,36,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px', maxWidth: 380, width: '100%', boxShadow: '0 8px 24px rgba(60,64,67,0.2)', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, background: '#fce8e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>🗑️</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#202124', marginBottom: 8 }}>Delete Doctor</h3>
              <p style={{ fontSize: 13, color: '#5f6368', marginBottom: 24, lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{doc?.name}</strong> from the list? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 24, padding: '10px', fontSize: 13, fontWeight: 500, color: '#5f6368', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, background: '#d93025', border: 'none', borderRadius: 24, padding: '10px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
