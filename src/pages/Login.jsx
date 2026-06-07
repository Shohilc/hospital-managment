import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authQueries } from '../db/queries';
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff, MdArrowDropDown } from 'react-icons/md';

const ROLES = ['Admin', 'Doctor', 'Patient', 'Pharmacist'];

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [registerOpen, setRegisterOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRegisterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { setError('Please select your role.'); return; }
    
    setIsLoading(true);
    try {
      // Try backend API first
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      
      if (response.ok) {
        const user = await response.json();
        if (form.rememberMe) localStorage.setItem('hms_remember', form.email);
        login(user);
        navigate('/dashboard');
        return;
      }
      
      if (response.status === 401) {
        // API is reachable but credentials are wrong — also try local DB
      }
    } catch (err) {
      // Backend not available — fall through to local SQLite
      console.log('Backend not available, using local database...');
    }
    
    // Fallback: try local SQLite database
    try {
      const user = authQueries.login(form.email, form.password);
      if (user) {
        if (form.rememberMe) localStorage.setItem('hms_remember', form.email);
        login(user);
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      console.log('Local DB query failed:', err);
    }
    
    setError('Invalid email or password. Please try again.');
    setIsLoading(false);
  };

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const inputStyle = {
    width: '100%', padding: '10px 12px 10px 40px',
    border: '1px solid #e0e0e0', borderRadius: 8,
    fontSize: 14, color: '#202124', outline: 'none',
    fontFamily: 'Inter, sans-serif', background: '#fff',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const iconStyle = {
    position: 'absolute', left: 12, top: '50%',
    transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 18,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top Nav ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 30, height: 30, background: '#1a73e8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>Hospira HMS</span>
        </div>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer' }}>← Back to Home</button>
      </nav>

      {/* ── Login Card ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '40px 40px 32px', width: '100%', maxWidth: 420, boxShadow: '0 2px 8px rgba(60,64,67,0.12)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: '#1a73e8', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>🏥</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 6 }}>Welcome back</h1>
            <p style={{ fontSize: 13, color: '#9aa0a6' }}>Sign in to Hospira HMS</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <MdEmail style={iconStyle} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => f('email', e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <MdLock style={iconStyle} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => f('password', e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9aa0a6', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 6 }}>Role</label>
              <div style={{ position: 'relative' }}>
                <MdPerson style={iconStyle} />
                <select
                  id="login-role"
                  value={form.role}
                  onChange={e => f('role', e.target.value)}
                  style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}
                  onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
                >
                  <option value="">Select your role...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <MdArrowDropDown style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 22, pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#5f6368' }}>
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={form.rememberMe}
                  onChange={e => f('rememberMe', e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: '#1a73e8' }}
                />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#1a73e8', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fce8e6', border: '1px solid #f5c6c3', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#d93025', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              id="login-btn"
              style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', transition: 'background 0.15s', marginTop: 4 }}
              onMouseEnter={e => e.target.style.background = '#1557b0'}
              onMouseLeave={e => e.target.style.background = '#1a73e8'}
            >
              Sign In
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
              <span style={{ fontSize: 12, color: '#9aa0a6' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
            </div>

            {/* Register Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                id="register-btn"
                onClick={() => setRegisterOpen(p => !p)}
                style={{ width: '100%', background: '#fff', color: '#1a73e8', border: '1px solid #1a73e8', borderRadius: 24, padding: '11px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e8f0fe'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Register as New User
                <MdArrowDropDown style={{ fontSize: 20, transform: registerOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {registerOpen && (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, boxShadow: '0 4px 16px rgba(60,64,67,0.15)', overflow: 'hidden', zIndex: 100 }}>
                  <button
                    id="register-doctor-btn"
                    onClick={() => { setRegisterOpen(false); navigate('/register/doctor'); }}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '14px 20px', fontSize: 13, fontWeight: 500, color: '#202124', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👨‍⚕️</span>
                    <div>
                      <div>Register as Doctor</div>
                      <div style={{ fontSize: 11, color: '#9aa0a6', fontWeight: 400 }}>For medical professionals</div>
                    </div>
                  </button>
                  <div style={{ height: 1, background: '#f1f3f4' }} />
                  <button
                    id="register-patient-btn"
                    onClick={() => { setRegisterOpen(false); navigate('/register/patient'); }}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '14px 20px', fontSize: 13, fontWeight: 500, color: '#202124', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</span>
                    <div>
                      <div>Register as Patient</div>
                      <div style={{ fontSize: 11, color: '#9aa0a6', fontWeight: 400 }}>Book appointments & track health</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
