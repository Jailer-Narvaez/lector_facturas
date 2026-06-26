import { useCallback, useState } from 'react';

// Autenticación SOLO demo (credenciales en el cliente). No usar en producción:
// cuando el backend exponga login real, reemplazar por una llamada a la API.
const DEMO_USER = { email: 'admin@davrant.com', password: 'demo123' };
const STORAGE_KEY = 'demo_user';

export interface Auth {
  user: string | null;
  /** Devuelve true si las credenciales son válidas e inicia sesión. */
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export function useAuth(): Auth {
  const [user, setUser] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY),
  );

  const login = useCallback((email: string, password: string): boolean => {
    const ok =
      email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password;
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, DEMO_USER.email);
      setUser(DEMO_USER.email);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, logout };
}
