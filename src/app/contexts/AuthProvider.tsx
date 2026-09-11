// app/contexts/AuthProvider.tsx
'use client';

import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext, type User } from './AuthContext';
import { loginWithPassword, logoutSession, refreshSession, registerPatient, type ApiUser } from '@/app/lib/api-client';

const toUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.email.split('@')[0] ?? '',
  email: user.email,
});

export const mapAuthError = () => 'Falha na autenticação. Tente novamente.';

interface Props { children: ReactNode }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void refreshSession().then((sessionUser) => {
      if (active) setUser(sessionUser ? toUser(sessionUser) : null);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setUser(toUser(await loginWithPassword(email, password)));
      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(async (_name: string, email: string, password: string) => {
    try {
      setUser(toUser(await registerPatient(email, password)));
      return true;
    } catch {
      return false;
    }
  }, []);

  const unsupportedSocialLogin = useCallback(async () => false, []);

  const logout = useCallback(async () => {
    await logoutSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register,
      loginWithGoogle: unsupportedSocialLogin,
      loginWithFacebook: unsupportedSocialLogin,
      logout, mapAuthError,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
