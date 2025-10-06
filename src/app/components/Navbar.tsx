"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/app/hooks/useAuth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleProfileMenu = () => setProfileMenuOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getLinkClass = (href: string) =>
    `${styles.navLink} ${pathname === href ? styles.activeLink : ""}`;

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Navegação principal">
      {/* Logo */}
      <Link href="/" className={styles.navbarLogo} aria-label="Página inicial">
        Medical
      </Link>

      {/* Links e perfil em flex row */}
      <div className={styles.navMenu}>
        {/* Links principais */}
        <div className={`${styles.navbarLinks} ${menuOpen ? styles.active : ""}`}>
          <Link href="/" className={getLinkClass("/")} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/patient" className={getLinkClass("/patient")} onClick={() => setMenuOpen(false)}>Pacientes</Link>
          <Link href="/doctors" className={getLinkClass("/doctors")} onClick={() => setMenuOpen(false)}>Médicos</Link>
          <Link href="/specialty" className={getLinkClass("/specialty")} onClick={() => setMenuOpen(false)}>Especialidades</Link>
          <Link href="/appointments" className={getLinkClass("/appointments")} onClick={() => setMenuOpen(false)}>Consultas</Link>
        </div>

        {/* Perfil */}
        <div className={styles.profileWrapper} ref={profileRef}>
          <button
            className={styles.profileBtn}
            onClick={toggleProfileMenu}
            aria-label={profileMenuOpen ? "Fechar menu de perfil" : "Abrir menu de perfil"}
            aria-expanded={profileMenuOpen}
          >
            <FaUserCircle />
          </button>

          {profileMenuOpen && (
            <div className={styles.profileMenu}>
              <button onClick={handleLogout} className={styles.profileMenuItem}>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toggle mobile */}
      <button
        className={styles.navbarToggle}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        aria-controls="navbarLinks"
        onClick={toggleMenu}
      >
        ☰
      </button>
    </nav>
  );
}
