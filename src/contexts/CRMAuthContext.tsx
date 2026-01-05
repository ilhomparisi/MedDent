import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const passwordHash = await hashPassword(password);

    const { data, error } = await supabase
      .from('crm_credentials')
      .select('id, username, password_hash, is_active')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      return { success: false, error: 'Xatolik yuz berdi' };
    }

    if (!data) {
      return { success: false, error: 'Foydalanuvchi topilmadi' };
    }

    if (!data.is_active) {
      return { success: false, error: 'Hisob faolsizlantirilgan' };
    }

    if (data.password_hash !== passwordHash) {
      return { success: false, error: 'Parol noto\'g\'ri' };
    }

    await supabase
      .from('crm_credentials')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);

    const session = {
      id: data.id,
      username: data.username,
      expiresAt: Date.now() + SESSION_TIMEOUT
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser({ id: data.id, username: data.username });

    return { success: true };
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
