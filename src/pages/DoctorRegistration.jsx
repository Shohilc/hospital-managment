import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPerson, MdEmail, MdPhone, MdArrowBack,
  MdArrowDropDown, MdAccessTime, MdAttachMoney
} from 'react-icons/md';

const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Gynecology',
  'Pediatrics',
  'Dermatology',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const QUALIFICATIONS = [
  'MBBS', 'MD', 'MS', 'MCh', 'DM', 'DNB',
  'BDS', 'MDS', 'BAMS', 'BHMS',
];

export default function DoctorRegistration() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    availableDays: [],
    timeFrom: '09:00',
    timeTo: '17:00',
  });

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const toggleDay = (day) => {
    setForm(p => ({
      ...p,
      availableDays: p.availableDays.includes(day)
        ? p.availableDays.filter(d => d !== day)
        : [...p.availableDays, day],
    }));
    setErrors(p => ({ ...p, availableDays: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (!form.specialization) e.specialization = 'Please select a specialization';
    if (!form.qualification) e.qualification = 'Please select a qualification';
    if (!form.experience) e.experience = 'Experience is required';
    else if (isNaN(form.experience) || +form.experience < 0) e.experience = 'Enter a valid number';
    if (!form.consultationFee) e.consultationFee = 'Consultation fee is required';
    else if (isNaN(form.consultationFee) || +form.consultationFee < 0) e.consultationFee = 'Enter a valid amount';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.availableDays.length === 0) e.availableDays = 'Select at least one available day';
    if (!form.timeFrom || !form.timeTo) e.timing = 'Please set available timing';
    else if (form.timeFrom >= form.timeTo) e.timing = 'End time must be after start time';
    return e;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setIsSubmitting(true);
    try {
      const schedule = `${form.availableDays.join(',')} ${form.timeFrom}-${form.timeTo}`;
      const response = await fetch('/api/register/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          specialization: form.specialization,
          department: form.specialization,
          schedule: schedule,
          fee: +form.consultationFee
        })
      });
      
      if (response.status === 409) {
        setErrors({ submit: 'An account with this email already exists' });
        return;
      }
      if (!response.ok) throw new Error('Registration failed');
      
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to connect to the server. Is the backend running?' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared styles ──
  const base = {
    width: '100%', padding: '11px 12px 11px 40px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 14, color: '#202124', outline: 'none',
    fontFamily: 'Inter, sans-serif', background: '#fff',
    boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
  };
  const baseNoIcon = { ...base, paddingLeft: 12 };
  const err = (k) => ({ ...base, borderColor: '#d93025', background: '#fffafa', ...(k === 'noicon' ? { paddingLeft: 12 } : {}) });
  const focus = e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; };
  const blur = (k) => e => { e.target.style.borderColor = errors[k] ? '#d93025' : '#e0e0e0'; e.target.style.boxShadow = 'none'; };
  const iconBox = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 18, display: 'flex', alignItems: 'center', pointerEvents: 'none' };
  const lbl = (text, req) => <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 6 }}>{text}{req && <span style={{ color: '#d93025', marginLeft: 2 }}>*</span>}</label>;
  const errMsg = (k) => errors[k] ? <span style={{ fontSize: 11, color: '#d93025', marginTop: 3, display: 'block' }}>⚠ {errors[k]}</span> : null;

  // ── Success ──
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20, padding: '52px 40px', textAlign: 'center', maxWidth: 420, width: '100%', boxShadow: '0 4px 16px rgba(60,64,67,0.1)' }}>
          <div style={{ width: 72, height: 72, background: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>👨‍⚕️</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 10 }}>Application Submitted!</h2>
          <p style={{ fontSize: 14, color: '#5f6368', lineHeight: 1.7, marginBottom: 8 }}>
            Welcome, <strong>Dr. {form.fullName}</strong>!
          </p>
          <p style={{ fontSize: 13, color: '#9aa0a6', marginBottom: 28 }}>Your registration is under review. You'll be notified once approved by the admin.</p>
          <button onClick={() => navigate('/login')} style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginBottom: 10 }}>
            Go to Login
          </button>
          <button onClick={() => { setSubmitted(false); setForm({ fullName:'',email:'',phone:'',password:'',confirmPassword:'',specialization:'',qualification:'',experience:'',consultationFee:'',availableDays:[],timeFrom:'09:00',timeTo:'17:00' }); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer' }}>
            Register another doctor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 30, height: 30, background: '#1a73e8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>Hospira HMS</span>
        </div>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <MdArrowBack style={{ fontSize: 16 }} /> Back to Login
        </button>
      </nav>

      {/* ── Form ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>👨‍⚕️</div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#202124', marginBottom: 6 }}>Doctor Registration</h1>
            <p style={{ fontSize: 13, color: '#9aa0a6' }}>Fill in your details to join Hospira HMS as a medical professional</p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(60,64,67,0.08)', display: 'flex', flexDirection: 'column', gap: 20 }}
          >

            {/* Full Name */}
            <div>
              {lbl('Full Name', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdPerson /></span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => f('fullName', e.target.value)}
                  placeholder="Dr. First Last"
                  style={errors.fullName ? { ...base, borderColor: '#d93025', background: '#fffafa' } : base}
                  onFocus={focus} onBlur={blur('fullName')}
                />
              </div>
              {errMsg('fullName')}
            </div>

            {/* Email */}
            <div>
              {lbl('Email Address', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdEmail /></span>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => f('email', e.target.value)}
                  placeholder="doctor@example.com"
                  style={errors.email ? { ...base, borderColor: '#d93025', background: '#fffafa' } : base}
                  onFocus={focus} onBlur={blur('email')}
                />
              </div>
              {errMsg('email')}
            </div>

            {/* Phone */}
            <div>
              {lbl('Phone Number', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdPhone /></span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => f('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  style={errors.phone ? { ...base, borderColor: '#d93025', background: '#fffafa' } : base}
                  onFocus={focus} onBlur={blur('phone')}
                />
              </div>
              {errMsg('phone')}
            </div>

            {/* Password */}
            <div>
              {lbl('Password', true)}
              <input
                type="password"
                value={form.password}
                onChange={e => f('password', e.target.value)}
                placeholder="Minimum 8 characters"
                style={errors.password ? { ...baseNoIcon, borderColor: '#d93025', background: '#fffafa' } : baseNoIcon}
                onFocus={focus} onBlur={blur('password')}
              />
              {errMsg('password')}
            </div>

            {/* Confirm Password */}
            <div>
              {lbl('Confirm Password', true)}
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => f('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                style={errors.confirmPassword ? { ...baseNoIcon, borderColor: '#d93025', background: '#fffafa' } : baseNoIcon}
                onFocus={focus} onBlur={blur('confirmPassword')}
              />
              {errMsg('confirmPassword')}
            </div>

            {/* Specialization */}
            <div>
              {lbl('Specialization', true)}
              <div style={{ position: 'relative' }}>
                <select
                  value={form.specialization}
                  onChange={e => f('specialization', e.target.value)}
                  style={{
                    ...baseNoIcon,
                    appearance: 'none',
                    paddingRight: 36,
                    ...(errors.specialization ? { borderColor: '#d93025', background: '#fffafa' } : {}),
                  }}
                  onFocus={focus} onBlur={blur('specialization')}
                >
                  <option value="">Select specialization...</option>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 22, pointerEvents: 'none', display: 'flex' }}>
                  <MdArrowDropDown />
                </span>
              </div>
              {errMsg('specialization')}
            </div>

            {/* Qualification + Experience — 2 col */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                {lbl('Qualification', true)}
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.qualification}
                    onChange={e => f('qualification', e.target.value)}
                    style={{
                      ...baseNoIcon,
                      appearance: 'none',
                      paddingRight: 36,
                      ...(errors.qualification ? { borderColor: '#d93025', background: '#fffafa' } : {}),
                    }}
                    onFocus={focus} onBlur={blur('qualification')}
                  >
                    <option value="">Select...</option>
                    {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 22, pointerEvents: 'none', display: 'flex' }}>
                    <MdArrowDropDown />
                  </span>
                </div>
                {errMsg('qualification')}
              </div>

              <div>
                {lbl('Experience (years)', true)}
                <input
                  type="number"
                  value={form.experience}
                  onChange={e => f('experience', e.target.value)}
                  placeholder="e.g. 5"
                  min={0} max={60}
                  style={errors.experience ? { ...baseNoIcon, borderColor: '#d93025', background: '#fffafa' } : baseNoIcon}
                  onFocus={focus} onBlur={blur('experience')}
                />
                {errMsg('experience')}
              </div>
            </div>

            {/* Consultation Fee */}
            <div>
              {lbl('Consultation Fee (₹)', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdAttachMoney /></span>
                <input
                  type="number"
                  value={form.consultationFee}
                  onChange={e => f('consultationFee', e.target.value)}
                  placeholder="e.g. 500"
                  min={0}
                  style={errors.consultationFee ? { ...base, borderColor: '#d93025', background: '#fffafa' } : base}
                  onFocus={focus} onBlur={blur('consultationFee')}
                />
              </div>
              {errMsg('consultationFee')}
            </div>

            {/* Available Days — Checkboxes */}
            <div>
              {lbl('Available Days', true)}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {DAYS.map(day => {
                  const checked = form.availableDays.includes(day);
                  return (
                    <label
                      key={day}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                        border: `1px solid ${checked ? '#1a73e8' : errors.availableDays ? '#d93025' : '#e0e0e0'}`,
                        background: checked ? '#e8f0fe' : '#fff',
                        color: checked ? '#1a73e8' : '#5f6368',
                        fontWeight: checked ? 600 : 400,
                        fontSize: 13,
                        transition: 'all 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDay(day)}
                        style={{ accentColor: '#1a73e8', width: 14, height: 14 }}
                      />
                      {day}
                    </label>
                  );
                })}
              </div>
              {errMsg('availableDays')}
            </div>

            {/* Available Timing */}
            <div>
              {lbl('Available Timing', true)}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={iconBox}><MdAccessTime /></span>
                  <input
                    type="time"
                    value={form.timeFrom}
                    onChange={e => { f('timeFrom', e.target.value); setErrors(p => ({ ...p, timing: '' })); }}
                    style={errors.timing ? { ...base, borderColor: '#d93025', background: '#fffafa' } : base}
                    onFocus={focus} onBlur={blur('timing')}
                  />
                </div>
                <span style={{ color: '#9aa0a6', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>to</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={iconBox}><MdAccessTime /></span>
                  <input
                    type="time"
                    value={form.timeTo}
                    onChange={e => { f('timeTo', e.target.value); setErrors(p => ({ ...p, timing: '' })); }}
                    style={errors.timing ? { ...base, borderColor: '#d93025', background: '#fffafa' } : base}
                    onFocus={focus} onBlur={blur('timing')}
                  />
                </div>
              </div>
              {errors.timing && <span style={{ fontSize: 11, color: '#d93025', marginTop: 3, display: 'block' }}>⚠ {errors.timing}</span>}
              {/* Preview */}
              {form.availableDays.length > 0 && (
                <div style={{ marginTop: 8, background: '#f8f9fa', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#5f6368', border: '1px solid #e0e0e0' }}>
                  📅 <strong>{form.availableDays.join(', ')}</strong> · {form.timeFrom} – {form.timeTo}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="doctor-register-submit"
              style={{
                background: '#1a73e8', color: '#fff', border: 'none',
                borderRadius: 24, padding: '13px', fontSize: 15,
                fontWeight: 600, cursor: 'pointer', width: '100%',
                marginTop: 4, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.target.style.background = '#1557b0'}
              onMouseLeave={e => e.target.style.background = '#1a73e8'}
            >
              Submit Application
            </button>
            
            {errors.submit && <div style={{ color: '#d93025', fontSize: 13, textAlign: 'center', marginTop: 4 }}>{errors.submit}</div>}

            {/* Sign in link */}
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
