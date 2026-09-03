import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from './page';

const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockLoginWithGoogle = jest.fn();
const mockLoginWithFacebook = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/app/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    loginWithGoogle: mockLoginWithGoogle,
    loginWithFacebook: mockLoginWithFacebook,
    mapAuthError: undefined,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the primary submit action disabled until credentials are present', () => {
    render(<LoginPage />);

    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Senha');
    const submit = screen.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement;

    expect(submit.disabled).toBe(true);

    fireEvent.change(email, { target: { value: 'teste@example.com' } });
    expect(submit.disabled).toBe(true);

    fireEvent.change(password, { target: { value: 'SenhaTeste123!' } });
    expect(submit.disabled).toBe(false);
  });

  it('shows a safe error and does not route when authentication is rejected', async () => {
    mockLogin.mockResolvedValue(false);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'invalid-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha na autenticação. Tente novamente.');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('submits normalized credentials and routes on successful authentication', async () => {
    mockLogin.mockResolvedValue(true);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: '  teste@example.com  ' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '  SenhaTeste123!  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('teste@example.com', 'SenhaTeste123!');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
