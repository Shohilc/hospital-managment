import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdArrowBack, MdLockReset } from 'react-icons/md';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email address is required.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* ── Nav ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 30, height: 30, background: '#1a73e8', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#202124' }}>Hospira HMS</span>
        </div>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#5f6368', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <MdArrowBack style={{ fontSize: 16 }} /> Back to Login
        </button>
      </nav>

      {/* ── Card ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: '44px 40px', width: '100%', maxWidth: 420, boxShadow: '0 2px 8px rgba(60,64,67,0.10)', textAlign: 'center' }}>

          {sent ? (
            /* ── Success state ── */
            <>
              <div style={{ width: 64, height: 64, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>📧</div>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 10 }}>Check your inbox</h1>
              <p style={{ fontSize: 14, color: '#5f6368', lineHeight: 1.7, marginBottom: 8 }}>
                We've sent a password reset link to
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1a73e8', marginBottom: 28 }}>{email}</p>
              <p style={{ fontSize: 12, color: '#9aa0a6', marginBottom: 28 }}>
                Didn't receive it? Check your spam folder or try again.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{ background: 'none', border: '1px solid #e0e0e0', borderRadius: 24, padding: '10px 24px', fontSize: 13, fontWeight: 500, color: '#5f6368', cursor: 'pointer', marginBottom: 12, width: '100%' }}
              >
                Try a different email
              </button>
              <button
                onClick={() => navigate('/login')}
                style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}
              >
                Back to Login
              </button>
            </>
          ) : (
            /* ── Form state ── */
            <>
              <div style={{ width: 56, height: 56, background: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26, color: '#1a73e8' }}>
                <MdLockReset />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 600, color: '#202124', marginBottom: 8 }}>Forgot password?</h1>
              <p style={{ fontSize: 13, color: '#9aa0a6', marginBottom: 32, lineHeight: 1.6 }}>
                Enter your registered email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#5f6368', display: 'block', marginBottom: 6 }}>
                  Email Address <span style={{ color: '#d93025' }}>*</span>
                </label>
                <div style={{ position: 'relative', marginBottom: 6 }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 18, display: 'flex', alignItems: 'center' }}>
                    <MdEmail />
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    autoFocus
                    style={{
                      width: '100%', padding: '11px 12px 11px 40px',
                      border: `1px solid ${error ? '#d93025' : '#e0e0e0'}`,
                      background: error ? '#fffafa' : '#fff',
                      borderRadius: 8, fontSize: 14, color: '#202124',
                      outline: 'none', fontFamily: 'Inter, sans-serif',
                      boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#1a73e8'; e.target.style.boxShadow = '0 0 0 2px rgba(26,115,232,0.14)'; }}
                    onBlur={e => { e.target.style.borderColor = error ? '#d93025' : '#e0e0e0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: 11, color: '#d93025', marginBottom: 16 }}>⚠️ {error}</p>
                )}

                <button
                  type="submit"
                  id="reset-password-btn"
                  style={{
                    width: '100%', background: '#1a73e8', color: '#fff',
                    border: 'none', borderRadius: 24, padding: '12px',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    marginTop: error ? 0 : 20, transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.background = '#1557b0'}
                  onMouseLeave={e => e.target.style.background = '#1a73e8'}
                >
                  Send Reset Link
                </button>
              </form>

              <p style={{ fontSize: 13, color: '#9aa0a6', marginTop: 20 }}>
                Remember your password?{' '}
                <span onClick={() => navigate('/login')} style={{ color: '#1a73e8', fontWeight: 500, cursor: 'pointer' }}>
                  Sign In
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
