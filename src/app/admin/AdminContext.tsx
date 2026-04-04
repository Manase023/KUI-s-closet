'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { adminLogin as serverLogin } from '../actions';

type AdminContextType = {
  isLoggedIn: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  activePage: string;
  setActivePage: (p: string) => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const login = async (u: string, p: string) => {
    const ok = await serverLogin(u, p);
    if (ok) setIsLoggedIn(true);
    return ok;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout, activePage, setActivePage }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be wrapped in AdminProvider');
  return ctx;
};
