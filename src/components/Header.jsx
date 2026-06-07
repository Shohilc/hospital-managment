import { MdSearch, MdNotifications, MdMenu, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useApp } from '../context/AppContext';

export default function Header({ title, sub, onMenuToggle }) {
  const { theme, toggleTheme } = useApp();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger — visible only on mobile/tablet */}
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          title="Toggle menu"
          aria-label="Toggle navigation menu"
        >
          <MdMenu />
        </button>
        <div className="header-title">
          <h1>{title}</h1>
          <p>{sub || dateStr}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <MdSearch style={{ fontSize: 18, flexShrink: 0 }} />
          <input placeholder="Quick search..." id="global-search" />
        </div>

        <button className="header-btn" title="Notifications">
          <MdNotifications />
        </button>

        {/* Theme toggle */}
        <button
          className="header-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
        </button>

        <div style={{
          background: 'linear-gradient(135deg, var(--blue), var(--teal))',
          borderRadius: '50%', width: 34, height: 34,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0
        }}>
          🏥
        </div>
      </div>
    </header>
  );
}
