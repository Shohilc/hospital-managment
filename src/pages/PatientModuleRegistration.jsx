import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPerson, MdPhone, MdLocationOn, MdArrowBack,
  MdArrowDropDown, MdUploadFile, MdClose, MdInsertDriveFile,
  MdLocalHospital
} from 'react-icons/md';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['Male', 'Female', 'Other'];

// ── reusable focused input ──────────────────────────────────
function FInput({ error, icon, style: extra, ...props }) {
  const ref = useRef();
  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 18, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          {icon}
        </span>
      )}
      <input
        ref={ref}
        {...props}
        style={{
          width: '100%', padding: `11px 12px 11px ${icon ? 40 : 12}px`,
          border: `1px solid ${error ? '#d93025' : '#e0e0e0'}`,
          background: error ? '#fffafa' : '#fff',
          borderRadius: 8, fontSize: 14, color: '#202124', outline: 'none',
          fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
          transition: 'border-color 0.15s, box-shadow 0.15s', ...extra,
        }}
        onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; }}
        onBlur={e => { e.target.style.borderColor = error ? '#d93025' : '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function FSelect({ error, children, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        {...props}
        style={{
          width: '100%', padding: '11px 36px 11px 12px',
          border: `1px solid ${error ? '#d93025' : '#e0e0e0'}`,
          background: error ? '#fffafa' : '#fff',
          borderRadius: 8, fontSize: 14, color: '#202124', outline: 'none',
          fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
          appearance: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; }}
        onBlur={e => { e.target.style.borderColor = error ? '#d93025' : '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
      >
        {children}
      </select>
      <MdArrowDropDown style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 22, pointerEvents: 'none' }} />
    </div>
  );
}

const Lbl = ({ text, req }) => (
  <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 6 }}>
    {text}{req && <span style={{ color: '#d93025', marginLeft: 2 }}>*</span>}
  </label>
);

const ErrMsg = ({ msg }) => msg
  ? <span style={{ fontSize: 11, color: '#d93025', marginTop: 3, display: 'block' }}>⚠ {msg}</span>
  : null;

// ─────────────────────────────────────────────────────────────
export default function PatientModuleRegistration() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyNumber: '',
    medicalHistory: '',
  });

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.age) e.age = 'Age is required';
    else if (isNaN(form.age) || +form.age < 1 || +form.age > 120) e.age = 'Enter a valid age (1–120)';
    if (!form.gender) e.gender = 'Please select a gender';
    if (!form.bloodGroup) e.bloodGroup = 'Please select a blood group';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.emergencyNumber.trim()) e.emergencyNumber = 'Emergency contact is required';
    else if (!/^\d{10}$/.test(form.emergencyNumber.replace(/\s/g, ''))) e.emergencyNumber = 'Enter a valid 10-digit number';
    return e;
  };

  const handleFiles = (incoming) => {
    const allowed = Array.from(incoming).filter(f =>
      ['image/png','image/jpeg','application/pdf'].includes(f.type)
    );
    setFiles(p => [...p, ...allowed].slice(0, 5));
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };
  const removeFile = (i) => setFiles(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  // ── file icon ──
  const fileIcon = (name) => {
    if (name.match(/\.(png|jpg|jpeg)$/i)) return '🖼️';
    if (name.match(/\.pdf$/i)) return '📄';
    return '📁';
  };

  // ── success screen ──
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20, padding: '52px 40px', textAlign: 'center', maxWidth: 420, width: '100%', boxShadow: '0 4px 16px rgba(60,64,67,0.1)' }}>
          <div style={{ width: 72, height: 72, background: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 10 }}>Patient Registered!</h2>
          <p style={{ fontSize: 14, color: '#5f6368', lineHeight: 1.7, marginBottom: 28 }}>
            <strong>{form.fullName}</strong> has been successfully registered in the system.
            {files.length > 0 && ` ${files.length} document(s) uploaded.`}
          </p>
          <button onClick={() => navigate('/login')} style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginBottom: 10 }}>
            Back to Login
          </button>
          <button onClick={() => { setSubmitted(false); setForm({ fullName:'',age:'',gender:'',bloodGroup:'',phone:'',address:'',emergencyNumber:'',medicalHistory:'' }); setFiles([]); setErrors({}); }}
            style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer' }}>
            Register another patient
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
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <MdArrowBack style={{ fontSize: 16 }} /> Back to Login
        </button>
      </nav>

      {/* ── Form ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '36px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: 620 }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>
              <MdLocalHospital style={{ color: '#1a73e8' }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#202124', marginBottom: 6 }}>Patient Registration</h1>
            <p style={{ fontSize: 13, color: '#9aa0a6' }}>Enter patient details to register them in the MediCore system</p>
          </div>

          <form onSubmit={handleSubmit} noValidate
            style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(60,64,67,0.08)', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Section label */}
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 6, borderBottom: '1px solid #f1f3f4' }}>
              Personal Information
            </div>

            {/* Full Name */}
            <div>
              <Lbl text="Full Name" req />
              <FInput icon={<MdPerson />} value={form.fullName} onChange={e => f('fullName', e.target.value)} placeholder="Enter patient's full name" error={errors.fullName} />
              <ErrMsg msg={errors.fullName} />
            </div>

            {/* Age + Gender — 2 col */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <Lbl text="Age" req />
                <FInput type="number" value={form.age} onChange={e => f('age', e.target.value)} placeholder="e.g. 34" min={1} max={120} error={errors.age} />
                <ErrMsg msg={errors.age} />
              </div>
              <div>
                <Lbl text="Gender" req />
                <FSelect value={form.gender} onChange={e => f('gender', e.target.value)} error={errors.gender}>
                  <option value="">Select gender...</option>
                  {GENDERS.map(g => <option key={g}>{g}</option>)}
                </FSelect>
                <ErrMsg msg={errors.gender} />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <Lbl text="Blood Group" req />
              <FSelect value={form.bloodGroup} onChange={e => f('bloodGroup', e.target.value)} error={errors.bloodGroup}>
                <option value="">Select blood group...</option>
                {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
              </FSelect>
              <ErrMsg msg={errors.bloodGroup} />
            </div>

            {/* Phone + Emergency — 2 col */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <Lbl text="Phone Number" req />
                <FInput icon={<MdPhone />} type="tel" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="10-digit number" maxLength={10} error={errors.phone} />
                <ErrMsg msg={errors.phone} />
              </div>
              <div>
                <Lbl text="Emergency Contact Number" req />
                <FInput icon={<MdPhone />} type="tel" value={form.emergencyNumber} onChange={e => f('emergencyNumber', e.target.value)} placeholder="10-digit number" maxLength={10} error={errors.emergencyNumber} />
                <ErrMsg msg={errors.emergencyNumber} />
              </div>
            </div>

            {/* Address */}
            <div>
              <Lbl text="Address" req />
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: 12, color: '#9aa0a6', fontSize: 18, pointerEvents: 'none', display: 'flex' }}>
                  <MdLocationOn />
                </span>
                <textarea
                  value={form.address}
                  onChange={e => f('address', e.target.value)}
                  placeholder="House no., Street, City, State, PIN code"
                  rows={3}
                  style={{
                    width: '100%', padding: '11px 12px 11px 40px',
                    border: `1px solid ${errors.address ? '#d93025' : '#e0e0e0'}`,
                    background: errors.address ? '#fffafa' : '#fff',
                    borderRadius: 8, fontSize: 14, color: '#202124', outline: 'none',
                    fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                    resize: 'none', lineHeight: 1.5,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.address ? '#d93025' : '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <ErrMsg msg={errors.address} />
            </div>

            {/* Divider */}
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 6, borderBottom: '1px solid #f1f3f4', marginTop: 4 }}>
              Medical Information
            </div>

            {/* Medical History */}
            <div>
              <Lbl text="Medical History" />
              <textarea
                value={form.medicalHistory}
                onChange={e => f('medicalHistory', e.target.value)}
                placeholder="Known conditions, past surgeries, chronic illnesses, current medications..."
                rows={4}
                style={{
                  width: '100%', padding: '11px 12px',
                  border: '1px solid #e0e0e0', background: '#fff',
                  borderRadius: 8, fontSize: 14, color: '#202124', outline: 'none',
                  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                  resize: 'vertical', lineHeight: 1.5, minHeight: 90,
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; }}
                onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Upload Documents */}
            <div>
              <Lbl text="Upload Documents" />
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? '#1a73e8' : '#d0d0d0'}`,
                  borderRadius: 10,
                  padding: '28px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? '#e8f0fe' : '#fafafa',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#5f6368', margin: '0 0 4px' }}>
                  Drag & drop files here, or <span style={{ color: '#1a73e8', textDecoration: 'underline' }}>browse</span>
                </p>
                <p style={{ fontSize: 11, color: '#9aa0a6', margin: 0 }}>
                  Supports: PDF, JPG, PNG · Max 5 files
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={e => handleFiles(e.target.files)}
                />
              </div>

              {/* Uploaded files list */}
              {files.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {files.map((file, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 12px' }}>
                      <span style={{ fontSize: 18 }}>{fileIcon(file.name)}</span>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                        <div style={{ fontSize: 11, color: '#9aa0a6', marginTop: 1 }}>{(file.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <button type="button" onClick={() => removeFile(i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9aa0a6', fontSize: 16, display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#d93025'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9aa0a6'}
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              id="patient-module-register-btn"
              style={{
                background: '#1a73e8', color: '#fff', border: 'none',
                borderRadius: 24, padding: '13px', fontSize: 15,
                fontWeight: 600, cursor: 'pointer', width: '100%',
                marginTop: 6, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.target.style.background = '#1557b0'}
              onMouseLeave={e => e.target.style.background = '#1a73e8'}
            >
              Register Patient
            </button>

            {/* Already have account */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#5f6368', marginTop: -4 }}>
              Already registered?{' '}
              <span onClick={() => navigate('/login')} style={{ color: '#1a73e8', fontWeight: 500, cursor: 'pointer' }}>
                Sign In
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
