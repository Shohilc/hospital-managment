import { useNavigate } from 'react-router-dom';
import { MdLocalHospital, MdPeople, MdCalendarToday, MdLocalPharmacy, MdScience, MdReceiptLong, MdArrowForward, MdCheck } from 'react-icons/md';
import MouseParticles from '../components/MouseParticles';

const FEATURES = [
  { icon: <MdPeople />, title: 'Patient Management', desc: 'Register, track, and manage all patient records with complete medical history.' },
  { icon: <MdLocalHospital />, title: 'Doctor Scheduling', desc: 'Manage doctor profiles, specializations, and appointment schedules.' },
  { icon: <MdCalendarToday />, title: 'Appointments', desc: 'Book and track appointments with real-time availability.' },
  { icon: <MdLocalPharmacy />, title: 'Pharmacy', desc: 'Full medicine inventory management with low-stock alerts.' },
  { icon: <MdScience />, title: 'Laboratory', desc: 'Order lab tests, enter results, and track test statuses.' },
  { icon: <MdReceiptLong />, title: 'Billing', desc: 'Generate invoices and track payments across all services.' },
];

const STATS = [
  { value: '10,000+', label: 'Patients Managed' },
  { value: '500+', label: 'Doctors Onboarded' },
  { value: '98%', label: 'Uptime Guaranteed' },
  { value: '50+', label: 'Hospitals Using Hospira' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page" style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <MouseParticles />

      {/* ── Floating Navbar ── */}
      <div className="landing-nav-wrapper" style={{ position: 'sticky', top: 24, zIndex: 100, padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <nav className="landing-nav-pill" style={{ 
          background: '#fff', 
          borderRadius: 40, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)', 
          padding: '8px 12px 8px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 960,
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, background: '#f0f2f5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏥</div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Hospira</span>
          </div>

          {/* Desktop Links */}
          <div className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['Products', 'Resources', 'Pricing', 'Enterprise'].map(link => (
              <span key={link} style={{ fontSize: 14, color: '#555', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                {link} {['Products', 'Resources'].includes(link) && <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span onClick={() => navigate('/login')} className="landing-nav-signin" style={{ fontSize: 14, color: '#555', fontWeight: 500, cursor: 'pointer' }}>Sign in</span>
            <button onClick={() => navigate('/login')} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background='#333'} onMouseLeave={e => e.target.style.background='#111'}>
              Get started
            </button>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="landing-hero" style={{ padding: '96px 64px 80px', textAlign: 'center', background: 'linear-gradient(180deg, #f8f9ff 0%, #fff 100%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e8f0fe', borderRadius: 24, padding: '6px 16px', marginBottom: 24, fontSize: 12, fontWeight: 600, color: '#1a73e8' }}>
          ✨ Modern Hospital Management
        </div>
        <h1 className="landing-hero-h1" style={{ fontSize: 52, fontWeight: 700, color: '#202124', lineHeight: 1.15, marginBottom: 20, maxWidth: 700, margin: '0 auto 20px' }}>
          Manage Your Hospital,{' '}
          <span style={{ color: '#1a73e8' }}>Smarter</span>
        </h1>
        <p style={{ fontSize: 18, color: '#5f6368', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Hospira HMS brings together patients, doctors, appointments, pharmacy, lab, and billing into one seamless platform.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/login')} style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            Start Free Trial <MdArrowForward />
          </button>
          <button onClick={() => navigate('/login')} style={{ background: '#fff', color: '#1a73e8', border: '1px solid #1a73e8', borderRadius: 24, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            View Demo
          </button>
        </div>

        {/* Hero card preview */}
        <div className="landing-stats-grid" style={{ marginTop: 64, background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 16, padding: '32px', maxWidth: 800, margin: '64px auto 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Patients', value: '1,284', color: '#1a73e8' },
            { label: 'Doctors Active', value: '48', color: '#1e8e3e' },
            { label: "Today's Appts", value: '23', color: '#7b1fa2' },
            { label: 'Revenue', value: '₹2.4L', color: '#f29900' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '20px 16px', border: '1px solid #e0e0e0', textAlign: 'left' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#9aa0a6', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="landing-stats-banner" style={{ background: '#1a73e8', padding: '48px 64px' }}>
        <div className="landing-stats-banner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features-section" style={{ padding: '80px 64px', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#202124', marginBottom: 12 }}>Everything You Need</h2>
          <p style={{ fontSize: 16, color: '#5f6368' }}>A complete suite of tools designed for modern hospitals.</p>
        </div>
        <div className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 12, padding: 28, transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(60,64,67,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ width: 44, height: 44, background: '#e8f0fe', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#1a73e8', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#202124', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#5f6368', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Hospira ── */}
      <section className="landing-why-section" style={{ padding: '80px 64px', background: '#f8f9fa' }}>
        <div className="landing-why-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#202124', marginBottom: 20, lineHeight: 1.3 }}>Why hospitals choose Hospira</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Real-time bed & ward tracking', 'Integrated billing across all departments', 'Role-based access for Admin, Doctor & Staff', 'SQLite-powered local database — no server needed', 'Clean, fast, modern interface'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MdCheck style={{ fontSize: 14, color: '#1e8e3e' }} />
                  </div>
                  <span style={{ fontSize: 14, color: '#5f6368' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(60,64,67,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#202124', marginBottom: 20 }}>Quick Access</h3>
            {[{ role: 'Admin', desc: 'Full system access', color: '#1a73e8', bg: '#e8f0fe' }, { role: 'Doctor', desc: 'Patients & appointments', color: '#1e8e3e', bg: '#e6f4ea' }, { role: 'Receptionist', desc: 'Scheduling & billing', color: '#7b1fa2', bg: '#f3e8fd' }].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid #f1f3f4' : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: r.color, fontWeight: 700 }}>{r.role[0]}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#202124' }}>{r.role}</div>
                  <div style={{ fontSize: 11, color: '#9aa0a6' }}>{r.desc}</div>
                </div>
                <button onClick={() => navigate('/login')} style={{ marginLeft: 'auto', background: 'none', border: '1px solid #e0e0e0', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: '#5f6368', cursor: 'pointer' }}>Login</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta" style={{ padding: '80px 64px', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: '#202124', marginBottom: 16 }}>Ready to get started?</h2>
        <p style={{ fontSize: 16, color: '#5f6368', marginBottom: 36 }}>Join hospitals already using Hospira to streamline operations.</p>
        <div className="landing-cta-buttons" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/register/patient')} style={{ background: '#fff', color: '#1a73e8', border: '1px solid #1a73e8', borderRadius: 24, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Register as Patient</button>
          <button onClick={() => navigate('/register/doctor')} style={{ background: '#fff', color: '#1e8e3e', border: '1px solid #1e8e3e', borderRadius: 24, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Register as Doctor</button>
          <button onClick={() => navigate('/login')} style={{ background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Sign In Now</button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer" style={{ background: '#f8f9fa', borderTop: '1px solid #e0e0e0', padding: '24px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#1a73e8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏥</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#202124' }}>Hospira HMS</span>
        </div>
        <p style={{ fontSize: 12, color: '#9aa0a6' }}>© 2026 Hospira HMS. All rights reserved.</p>
      </footer>
    </div>
  );
}
