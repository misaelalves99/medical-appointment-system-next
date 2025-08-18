// src/components/Navbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const getLinkClass = (href: string) =>
    `${styles.navLink} ${pathname === href ? styles.activeLink : ""}`;

  return (
    <nav
      className={styles.navbar}
      role="navigation"
      aria-label="Navegação principal"
    >
      <Link href="/" className={styles.navbarLogo} aria-label="Página inicial">
        Medical
      </Link>

      <button
        className={styles.navbarToggle}
        id="navbarToggle"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        aria-controls="navbarLinks"
        onClick={toggleMenu}
      >
        ☰
      </button>

      <div
        className={`${styles.navbarLinks} ${menuOpen ? styles.active : ""}`}
        id="navbarLinks"
      >
        <Link
          href="/"
          className={getLinkClass("/")}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          href="/patient"
          className={getLinkClass("/patient")}
          onClick={() => setMenuOpen(false)}
        >
          Pacientes
        </Link>

        <Link
          href="/doctors"
          className={getLinkClass("/doctors")}
          onClick={() => setMenuOpen(false)}
        >
          Médicos
        </Link>

        <Link
          href="/specialty"
          className={getLinkClass("/specialty")}
          onClick={() => setMenuOpen(false)}
        >
          Especialidades
        </Link>

        <Link
          href="/appointments"
          className={getLinkClass("/appointments")}
          onClick={() => setMenuOpen(false)}
        >
          Consultas
        </Link>
      </div>
    </nav>
  );
}
