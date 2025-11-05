// app/contexts/AuthContext.tsx
'use client';

import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  logout: () => Promise<void>;
  mapAuthError: (code?: string) => string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
