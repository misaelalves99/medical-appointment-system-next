'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import DashboardShell from './components/DashboardShell';

interface ProtectedAppProps {
  children: ReactNode;
}

export default function ProtectedApp({ children }: ProtectedAppProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const publicRoutes = ['/auth/login', '/auth/register'];
  const requiresLogin = !user && !publicRoutes.includes(pathname);

  useEffect(() => {
    if (requiresLogin) {
      router.replace('/auth/login');
    }
  }, [requiresLogin, router]);

  if (requiresLogin) {
    return null;
  }
const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <main style={{ minHeight: '100vh' }}>{children}</main>;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
