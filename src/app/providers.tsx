'use client';

import { ReactNode } from 'react';
import ProtectedApp from './ProtectedApp';
import { PatientProvider } from './contexts/PatientProvider';
import { DoctorsProvider } from './contexts/DoctorProvider';
import { SpecialtyProvider } from './contexts/SpecialtyProvider';
import { AppointmentsProvider } from './contexts/AppointmentsProvider';
import { AuthProvider } from './contexts/AuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <PatientProvider>
        <DoctorsProvider>
          <SpecialtyProvider>
            <AppointmentsProvider>
              <ProtectedApp>{children}</ProtectedApp>
            </AppointmentsProvider>
          </SpecialtyProvider>
        </DoctorsProvider>
      </PatientProvider>
    </AuthProvider>
  );
}