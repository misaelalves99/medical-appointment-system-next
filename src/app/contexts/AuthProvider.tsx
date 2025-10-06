// app/contexts/AuthProvider.tsx
'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  type User
} from 'firebase/auth';
import { app } from '../lib/firebase';

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(auth.currentUser);

  // Observa alterações de login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Login com email/senha
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Registro com email/senha e opcionalmente displayName
  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  // Login com Google
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // Login com Facebook
  const loginWithFacebook = async (): Promise<boolean> => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
