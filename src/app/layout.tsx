// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
        <Navbar />
        <main style={{ minHeight: "80vh", padding: "1rem" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
