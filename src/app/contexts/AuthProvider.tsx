// app/contexts/AuthProvider.tsx
'use client';

import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext, type User } from './AuthContext';
import { auth, googleProvider, facebookProvider } from '@/app/lib/firebase';
import { FirebaseError } from 'firebase/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';

/** âžœ normaliza o usuÃ¡rio do Firebase */
const toUser = (u: FirebaseUser): User => ({
  id: u.uid,
  name: u.displayName ?? '',
  email: u.email ?? '',
  photoURL: u.photoURL ?? undefined,
});

/** âžœ mensagens amigÃ¡veis de erro */
export const mapAuthError = (code?: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail invÃ¡lido.';
    case 'auth/user-not-found':
      return 'UsuÃ¡rio nÃ£o encontrado.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail jÃ¡ estÃ¡ cadastrado.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/unauthorized-domain':
      return 'DomÃ­nio nÃ£o autorizado nas configuraÃ§Ãµes do Firebase.';
    default:
      return 'Falha na autenticaÃ§Ã£o. Tente novamente.';
  }
};

const logAuthError = (scope: string, error: unknown) => {
  if (error instanceof FirebaseError) {
    console.error(scope, error.code, error.message);
    return;
  }

  console.error(scope, 'unknown-error');
};

interface Props { children: ReactNode }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // observa a sessÃ£o
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb) => {
      if (fb) setUser(toUser(fb));
      else setUser(null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // email/senha
  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      return true;
    } catch (e: unknown) {
      logAuthError('login:', e);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      if (cred.user && name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      return true;
    } catch (e: unknown) {
      logAuthError('register:', e);
      return false;
    }
  }, []);

  // sociais
  const loginWithGoogle = useCallback(async () => {
    try { await signInWithPopup(auth, googleProvider); return true; }
    catch (e: unknown) { logAuthError('google:', e); return false; }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try { await signInWithPopup(auth, facebookProvider); return true; }
    catch (e: unknown) { logAuthError('facebook:', e); return false; }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        mapAuthError,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
