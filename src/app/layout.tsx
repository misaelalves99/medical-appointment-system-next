// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Providers de contexto
import { PatientProvider } from "./contexts/PatientProvider";
import { DoctorsProvider } from "./contexts/DoctorProvider";
import { AppointmentsProvider } from "./contexts/AppointmentsProvider";
import { SpecialtyProvider } from "./contexts/SpecialtyProvider";

export const metadata: Metadata = {
  title: "Medical Appointment System",
  description: "Sistema de agendamento médico em Next.js 14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Providers globais para toda a aplicação */}
        <PatientProvider>
          <DoctorsProvider>
            <SpecialtyProvider>
              <AppointmentsProvider>
                <Navbar />
                <main style={{ minHeight: "80vh", padding: "1rem" }}>
                  {children}
                </main>
                <Footer />
              </AppointmentsProvider>
            </SpecialtyProvider>
          </DoctorsProvider>
        </PatientProvider>
      </body>
    </html>
  );
}
