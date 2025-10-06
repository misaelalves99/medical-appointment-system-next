// app/contexts/AuthContext.tsxx

'use client';

import { createContext } from 'react';
import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
