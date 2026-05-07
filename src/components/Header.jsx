import { MdSearch, MdNotifications } from 'react-icons/md';

export default function Header({ title, sub }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title">
          <h1>{title}</h1>
          <p>{sub || dateStr}</p>
        </div>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <MdSearch style={{ fontSize: 18 }} />
          <input placeholder="Quick search..." id="global-search" />
        </div>
        <button className="header-btn" title="Notifications">
          <MdNotifications />
        </button>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent), var(--teal))',
          borderRadius: '50%', width: 34, height: 34,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 13, fontWeight: 700
        }}>
          🏥
        </div>
      </div>
    </header>
  );
}
