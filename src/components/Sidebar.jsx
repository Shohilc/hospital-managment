import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  MdDashboard, MdPeople, MdLocalHospital, MdCalendarToday,
  MdBed, MdLocalPharmacy, MdScience, MdReceiptLong,
  MdPerson, MdLogout
} from 'react-icons/md';

const NAV = [
  { label: 'Overview', items: [
    { to: '/dashboard', icon: <MdDashboard />, text: 'Dashboard' },
  ]},
  { label: 'Clinical', items: [
    { to: '/patients', icon: <MdPeople />, text: 'Patients' },
    { to: '/doctors', icon: <MdLocalHospital />, text: 'Doctors' },
    { to: '/appointments', icon: <MdCalendarToday />, text: 'Appointments' },
    { to: '/wards', icon: <MdBed />, text: 'Wards & Beds' },
  ]},
  { label: 'Services', items: [
    { to: '/pharmacy', icon: <MdLocalPharmacy />, text: 'Pharmacy' },
    { to: '/lab', icon: <MdScience />, text: 'Laboratory' },
    { to: '/billing', icon: <MdReceiptLong />, text: 'Billing' },
  ]},
  { label: 'Admin', items: [
    { to: '/staff', icon: <MdPerson />, text: 'Staff' },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useApp();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏥</div>
        <div className="logo-text">
          <h2>MediCore</h2>
          <span>Hospital Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(section => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.text}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="user-details" style={{ flex: 1 }}>
            <p>{user?.name || 'Admin'}</p>
            <span>{user?.role || 'Administrator'}</span>
          </div>
          <button
            onClick={logout}
            style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:18 }}
            title="Logout"
          >
            <MdLogout />
          </button>
        </div>
      </div>
    </aside>
  );
}
