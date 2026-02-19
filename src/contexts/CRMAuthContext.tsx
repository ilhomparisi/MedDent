import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

interface CRMUser {
  id: string;
  username: string;
}

interface CRMAuthContextType {
  user: CRMUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const CRMAuthContext = createContext<CRMAuthContextType | undefined>(undefined);

const SESSION_KEY = 'crm_session';
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

export function CRMAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CRMUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.expiresAt > Date.now()) {
          setUser({ id: session.id, username: session.username });
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await api.crmLogin(username, password);
      
      if (result.success && result.user) {
        const session = {
          id: result.user.id,
          username: result.user.username,
          expiresAt: Date.now() + SESSION_TIMEOUT
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser({ id: result.user.id, username: result.user.username });
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Xatolik yuz berdi' };
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <CRMAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </CRMAuthContext.Provider>
  );
}

export function useCRMAuth() {
  const context = useContext(CRMAuthContext);
  if (context === undefined) {
    throw new Error('useCRMAuth must be used within a CRMAuthProvider');
  }
  return context;
}
