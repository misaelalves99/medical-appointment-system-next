import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import AppProviders from './providers';

export const metadata: Metadata = {
  title: 'Medical Appointment System',
  description: 'Demo portfolio application for medical appointment scheduling.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}