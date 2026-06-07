import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDB } from '../db/database';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [dbReady, setDbReady] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('hms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [toasts, setToasts] = useState([]);

  // ── Theme ──
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hms_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hms_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  // ── Sidebar collapsed (desktop) ──
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('hms_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed(v => {
      const next = !v;
      localStorage.setItem('hms_sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js';
    script.onload = async () => {
      await initDB();
      setDbReady(true);
    };
    document.head.appendChild(script);
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('hms_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('hms_user');
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  return (
    <AppContext.Provider value={{
      dbReady, user, login, logout,
      toasts, addToast,
      theme, toggleTheme,
      sidebarCollapsed, toggleSidebarCollapsed,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
