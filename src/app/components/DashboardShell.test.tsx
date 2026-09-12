import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DashboardShell from './DashboardShell';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

jest.mock('next/navigation', () => ({ usePathname: jest.fn(), useRouter: jest.fn() }));
jest.mock('../hooks/useAuth', () => ({ useAuth: jest.fn() }));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('DashboardShell', () => {
  const push = jest.fn();
  const logout = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/appointments');
    mockUseRouter.mockReturnValue({
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push,
      replace: jest.fn(),
      prefetch: jest.fn(),
  bfcacheId: "test-bfcache",
    });
    mockUseAuth.mockReturnValue({
      user: { id: 'stage04-user', name: 'Usuário Teste Stage04', email: 'stage04@example.com' },
      loading: false,
      login: jest.fn(),
      register: jest.fn(),
      loginWithGoogle: jest.fn(),
      loginWithFacebook: jest.fn(),
      logout,
      mapAuthError: jest.fn(),
    });
  });

  it('renders authenticated navigation and marks the current workspace', () => {
    render(<DashboardShell><div>Conteúdo protegido</div></DashboardShell>);
    expect(screen.getByLabelText('Navegação principal')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Consultas' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument();
    expect(screen.getByText('Usuário Teste Stage04')).toBeInTheDocument();
  });

  it('opens the responsive mobile navigation', () => {
    render(<DashboardShell><div>Conteúdo</div></DashboardShell>);
    const openMenu = screen.getByRole('button', { name: 'Abrir menu' });
    expect(openMenu).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(openMenu);
    expect(openMenu).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toBeInTheDocument();
  });

  it('closes the responsive mobile navigation with Escape', () => {
    render(<DashboardShell><div>Conteúdo</div></DashboardShell>);
    const openMenu = screen.getByRole('button', { name: 'Abrir menu' });

    fireEvent.click(openMenu);
    expect(openMenu).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(openMenu).toHaveAttribute('aria-expanded', 'false');
  });

  it('logs out and routes to login', async () => {
    render(<DashboardShell><div>Conteúdo</div></DashboardShell>);
    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    expect(push).toHaveBeenCalledWith('/auth/login');
  });
});

