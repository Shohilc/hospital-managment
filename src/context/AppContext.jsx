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
    <AppContext.Provider value={{ dbReady, user, login, logout, toasts, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
