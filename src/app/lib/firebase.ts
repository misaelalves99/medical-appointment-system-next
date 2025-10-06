// app/lib/firebase.ts
'use client';

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

// 🔑 Configuração Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Provedores sociais
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Funções utilitárias

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao logar com email/senha:", error);
    return null;
  }
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<FirebaseUser | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Atualiza o displayName do usuário registrado
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, { displayName: name });
    }

    return userCredential.user;
  } catch (error) {
    console.error("Erro ao registrar com email/senha:", error);
    return null;
  }
}

export async function loginWithGooglePopup(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erro ao logar com Google:", error);
    return null;
  }
}

export async function loginWithFacebookPopup(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error) {
    console.error("Erro ao logar com Facebook:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }
}
