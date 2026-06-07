import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPerson, MdEmail, MdPhone, MdLock, MdVisibility, MdVisibilityOff, MdLocationOn } from 'react-icons/md';
import { patientQueries, authQueries } from '../db/queries';

export default function PatientRegistration() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    address: '',
  });

  const f = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.gender) e.gender = 'Please select your gender';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.address.trim()) e.address = 'Address is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      // Check if email already registered
      if (authQueries.emailExists(form.email)) {
        setErrors({ submit: 'This email is already registered. Please sign in.' });
        return;
      }

      const age = new Date().getFullYear() - new Date(form.dob).getFullYear();

      // Save patient record
      patientQueries.create({
        name: form.fullName,
        age,
        gender: form.gender,
        blood_group: 'Unknown',
        phone: form.phone,
        email: form.email,
        address: form.address,
        medical_history: 'None',
        status: 'Active',
      });

      // Create login account
      authQueries.register(form.fullName, form.email, form.password, 'Patient');

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

  // ── Shared styles ──
  const inputBase = {
    width: '100%', padding: '11px 12px 11px 40px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 14, color: '#202124', outline: 'none',
    fontFamily: 'Inter, sans-serif', background: '#fff',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  };
  const inputErr = { ...inputBase, borderColor: '#d93025', background: '#fffafa' };
  const iconBox = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 18, display: 'flex', alignItems: 'center' };
  const focus = (e) => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; };
  const blur = (e) => { e.target.style.borderColor = errors[e.target.name] ? '#d93025' : '#e0e0e0'; e.target.style.boxShadow = 'none'; };
  const errMsg = (k) => errors[k] ? <span style={{ fontSize: 11, color: '#d93025', marginTop: 3, display: 'block' }}>{errors[k]}</span> : null;
  const label = (text, req) => (
    <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 5 }}>
      {text}{req && <span style={{ color: '#d93025', marginLeft: 2 }}>*</span>}
    </label>
  );

  // ── Success screen ──
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20, padding: '52px 40px', textAlign: 'center', maxWidth: 400, width: '100%', boxShadow: '0 4px 16px rgba(60,64,67,0.1)' }}>
          <div style={{ width: 72, height: 72, background: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 10 }}>Registration Successful!</h2>
          <p style={{ fontSize: 14, color: '#5f6368', lineHeight: 1.7, marginBottom: 28 }}>
            Welcome, <strong>{form.fullName}</strong>!<br />Your patient account has been created. You can now sign in.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }}
          >
            Go to Login
          </button>
          <button
            onClick={() => { setSubmitted(false); setForm({ fullName:'',email:'',phone:'',password:'',confirmPassword:'',gender:'',dob:'',address:'' }); }}
            style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer', marginTop: 12 }}
          >
            Register another patient
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Bar ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 30, height: 30, background: '#1a73e8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>Hospira HMS</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <MdArrowBack style={{ fontSize: 16 }} /> Back to Login
        </button>
      </nav>

      {/* ── Form Card ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: '#1a73e8', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>🏥</div>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#202124', marginBottom: 6 }}>Patient Registration</h1>
            <p style={{ fontSize: 13, color: '#9aa0a6' }}>Create your account to book appointments and manage your health</p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '32px', boxShadow: '0 2px 8px rgba(60,64,67,0.08)', display: 'flex', flexDirection: 'column', gap: 20 }}
          >

            {/* Full Name */}
            <div>
              {label('Full Name', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdPerson /></span>
                <input
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={e => f('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  style={errors.fullName ? inputErr : inputBase}
                  onFocus={focus} onBlur={blur}
                />
              </div>
              {errMsg('fullName')}
            </div>

            {/* Email */}
            <div>
              {label('Email Address', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdEmail /></span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={e => f('email', e.target.value)}
                  placeholder="you@example.com"
                  style={errors.email ? inputErr : inputBase}
                  onFocus={focus} onBlur={blur}
                />
              </div>
              {errMsg('email')}
            </div>

            {/* Phone */}
            <div>
              {label('Phone Number', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdPhone /></span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => f('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  style={errors.phone ? inputErr : inputBase}
                  onFocus={focus} onBlur={blur}
                  maxLength={10}
                />
              </div>
              {errMsg('phone')}
            </div>

            {/* Password */}
            <div>
              {label('Password', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdLock /></span>
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => f('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  style={{ ...(errors.password ? inputErr : inputBase), paddingRight: 42 }}
                  onFocus={focus} onBlur={blur}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9aa0a6', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', padding: 0 }}
                  tabIndex={-1}
                >
                  {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errMsg('password')}
            </div>

            {/* Confirm Password */}
            <div>
              {label('Confirm Password', true)}
              <div style={{ position: 'relative' }}>
                <span style={iconBox}><MdLock /></span>
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => f('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  style={{ ...(errors.confirmPassword ? inputErr : inputBase), paddingRight: 42 }}
                  onFocus={focus} onBlur={blur}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9aa0a6', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', padding: 0 }}
                  tabIndex={-1}
                >
                  {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errMsg('confirmPassword')}
            </div>

            {/* Gender — Radio buttons */}
            <div>
              {label('Gender', true)}
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                {['Male', 'Female', 'Other'].map(g => (
                  <label
                    key={g}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${form.gender === g ? '#1a73e8' : errors.gender ? '#d93025' : '#e0e0e0'}`,
                      background: form.gender === g ? '#e8f0fe' : '#fff',
                      color: form.gender === g ? '#1a73e8' : '#5f6368',
                      fontWeight: form.gender === g ? 600 : 400,
                      fontSize: 13, transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={e => f('gender', e.target.value)}
                      style={{ accentColor: '#1a73e8', width: 15, height: 15 }}
                    />
                    {g}
                  </label>
                ))}
              </div>
              {errMsg('gender')}
            </div>

            {/* Date of Birth */}
            <div>
              {label('Date of Birth', true)}
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={e => f('dob', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={errors.dob ? { ...inputErr, paddingLeft: 12 } : { ...inputBase, paddingLeft: 12 }}
                onFocus={focus} onBlur={blur}
              />
              {errMsg('dob')}
            </div>

            {/* Address */}
            <div>
              {label('Address', true)}
              <div style={{ position: 'relative' }}>
                <span style={{ ...iconBox, top: 14, transform: 'none' }}><MdLocationOn /></span>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={e => f('address', e.target.value)}
                  placeholder="House no., Street, City, State, PIN code"
                  rows={3}
                  style={{
                    ...( errors.address ? inputErr : inputBase ),
                    paddingTop: 10, paddingBottom: 10,
                    resize: 'none', lineHeight: 1.5,
                  }}
                  onFocus={focus} onBlur={blur}
                />
              </div>
              {errMsg('address')}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              id="patient-register-btn"
              style={{
                background: '#1a73e8', color: '#fff', border: 'none',
                borderRadius: 24, padding: '13px', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', width: '100%', marginTop: 4,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.target.style.background = '#1557b0'}
              onMouseLeave={e => e.target.style.background = '#1a73e8'}
              disabled={false}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
            
            {errors.submit && <div style={{ color: '#d93025', fontSize: 13, textAlign: 'center', marginTop: 4 }}>{errors.submit}</div>}

            {/* Login link */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#5f6368', marginTop: -4 }}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{ color: '#1a73e8', fontWeight: 500, cursor: 'pointer' }}
              >
                Sign In
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
