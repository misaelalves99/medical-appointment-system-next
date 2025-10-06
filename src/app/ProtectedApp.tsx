'use client';

import { ReactNode } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePathname, redirect } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

interface ProtectedAppProps {
  children: ReactNode;
}

export default function ProtectedApp({ children }: ProtectedAppProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Rotas públicas: login e registro
  const publicRoutes = ['/auth/login', '/auth/register'];

  // Se usuário não logado e tentar acessar rota privada, redireciona para login
  if (!user && !publicRoutes.includes(pathname)) {
    redirect('/auth/login');
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <>
      {/* Navbar só aparece em rotas privadas */}
      {!isPublicRoute && <Navbar />}
      
      <main style={{ minHeight: '80vh' }}>{children}</main>

      {/* Footer só aparece em rotas privadas */}
      {!isPublicRoute && <Footer />}
    </>
  );
}
