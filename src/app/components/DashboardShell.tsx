'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaHome, FaSignOutAlt, FaStethoscope, FaTimes, FaUserInjured, FaUserMd } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import styles from './DashboardShell.module.css';

interface DashboardShellProps { children: ReactNode }

const navigation = [
  { href: '/', label: 'Dashboard', icon: FaHome },
  { href: '/appointments', label: 'Consultas', icon: FaCalendarAlt },
  { href: '/patient', label: 'Pacientes', icon: FaUserInjured },
  { href: '/doctors', label: 'Médicos', icon: FaUserMd },
  { href: '/specialty', label: 'Especialidades', icon: FaStethoscope },
];

const getPageTitle = (pathname: string) => {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/appointments')) return 'Consultas';
  if (pathname.startsWith('/patient')) return 'Pacientes';
  if (pathname.startsWith('/doctors')) return 'Médicos';
  if (pathname.startsWith('/specialty')) return 'Especialidades';
  return 'Medical';
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobile();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className={styles.shell}>
      {mobileOpen && <button type="button" className={styles.backdrop} aria-label="Fechar navegação" onClick={closeMobile} />}

      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`} aria-label="Navegação principal">
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand} onClick={closeMobile} aria-label="Ir para o dashboard">
            <span className={styles.brandMark}>M</span>
            {!collapsed && <span className={styles.brandText}>Medical</span>}
          </Link>
          <button type="button" className={styles.mobileClose} aria-label="Fechar menu" onClick={closeMobile}>
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.nav}>
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`${styles.navItem} ${active ? styles.navItemActive : ''}`} aria-current={active ? 'page' : undefined} onClick={closeMobile} title={collapsed ? label : undefined}>
                <Icon className={styles.navIcon} aria-hidden="true" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button type="button" className={styles.collapseButton} onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'} aria-expanded={!collapsed}>
            {collapsed ? <FaChevronRight aria-hidden="true" /> : <FaChevronLeft aria-hidden="true" />}
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.topbarStart}>
            <button type="button" className={styles.mobileMenu} aria-label="Abrir menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
              <FaBars aria-hidden="true" />
            </button>
            <div>
              <p className={styles.eyebrow}>Sistema de Agendamento</p>
              <h1 className={styles.pageTitle}>{getPageTitle(pathname)}</h1>
            </div>
          </div>

          <div className={styles.account}>
            <div className={styles.accountCopy}>
              <span className={styles.accountName}>{user?.name || 'Usuário'}</span>
              <span className={styles.accountEmail}>{user?.email || 'Sessão autenticada'}</span>
            </div>
            <div className={styles.avatar} aria-hidden="true">{(user?.name || user?.email || 'U').trim().charAt(0).toUpperCase()}</div>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
              <FaSignOutAlt aria-hidden="true" />
              <span>Sair</span>
            </button>
          </div>
        </header>

        <div role="main" className={styles.main}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
