'use client';

import { ReactNode } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePathname, redirect } from 'next/navigation';
import DashboardShell from './components/DashboardShell';

interface ProtectedAppProps {
  children: ReactNode;
}

export default function ProtectedApp({ children }: ProtectedAppProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const publicRoutes = ['/auth/login', '/auth/register'];

  if (!user && !publicRoutes.includes(pathname)) {
    redirect('/auth/login');
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <main style={{ minHeight: '100vh' }}>{children}</main>;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
