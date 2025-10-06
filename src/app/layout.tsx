// app/layout.tsx
'use client';

import './globals.css';
import { ReactNode } from 'react';
import ProtectedApp from './ProtectedApp';

// Providers de contexto
import { PatientProvider } from './contexts/PatientProvider';
import { DoctorsProvider } from './contexts/DoctorProvider';
import { SpecialtyProvider } from './contexts/SpecialtyProvider';
import { AppointmentsProvider } from './contexts/AppointmentsProvider';
import { AuthProvider } from './contexts/AuthProvider'; // ✅ AuthProvider do Firebase

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider> {/* 🔒 Protege toda a aplicação */}
          <PatientProvider>
            <DoctorsProvider>
              <SpecialtyProvider>
                <AppointmentsProvider>
                  <ProtectedApp>
                    {children}
                  </ProtectedApp>
                </AppointmentsProvider>
              </SpecialtyProvider>
            </DoctorsProvider>
          </PatientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
