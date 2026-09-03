import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RegisterPage from './page';

const mockPush = jest.fn();
const mockRegister = jest.fn();
const mockLoginWithGoogle = jest.fn();
const mockLoginWithFacebook = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/app/hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
    loginWithGoogle: mockLoginWithGoogle,
    loginWithFacebook: mockLoginWithFacebook,
    mapAuthError: undefined,
  }),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the primary submit action disabled until required registration data is valid', () => {
    render(<RegisterPage />);

    const name = screen.getByLabelText('Nome completo');
    const email = screen.getByLabelText('E-mail');
    const password = screen.getByLabelText('Senha');
    const submit = screen.getByRole('button', { name: 'Registrar' }) as HTMLButtonElement;

    expect(submit.disabled).toBe(true);

    fireEvent.change(name, { target: { value: 'Pessoa Teste' } });
    fireEvent.change(email, { target: { value: 'teste@example.com' } });
    fireEvent.change(password, { target: { value: '12345' } });
    expect(submit.disabled).toBe(true);

    fireEvent.change(password, { target: { value: 'SenhaTeste123!' } });
    expect(submit.disabled).toBe(false);
  });

  it('submits normalized registration data and routes on successful registration', async () => {
    mockRegister.mockResolvedValue(true);

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: '  Pessoa Teste  ' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: '  teste@example.com  ' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '  SenhaTeste123!  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Pessoa Teste', 'teste@example.com', 'SenhaTeste123!');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
