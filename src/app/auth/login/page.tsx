// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth';
import SocialButton from '@/app/components/ui/SocialButton';
import styles from '../AuthForm.module.css';

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) router.push('/');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);
    if (success) router.push('/');
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    const success = await loginWithFacebook();
    setLoading(false);
    if (success) router.push('/');
  };

  return (
    <div className={styles.container}>
      {/* Imagem + overlay */}
      <div className={styles.imageSide}>
        <div className={styles.overlay}>
          <h2 className={styles.welcomeTitle}>Movendo a empresa para frente</h2>
          <p className={styles.welcomeText}>
            Priorizando eficiência, inovação e confiança em cada ação.
          </p>
        </div>
        <img src="/assets/auth-banner.png" alt="Sistema Médico" />
      </div>

      {/* Formulário */}
      <div className={styles.formSide}>
        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.subtitle}>
          Acesse sua conta para continuar gerenciando suas consultas.
        </p>

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <div className={styles.socialButtons}>
          <SocialButton icon={FaGoogle} color="#DB4437" onClick={handleGoogleLogin} />
          <SocialButton icon={FaFacebookF} color="#1877F2" onClick={handleFacebookLogin} />
        </div>

        <p className={styles.text}>
          Não possui uma conta?{' '}
          <Link href="/auth/register" className={styles.link}>
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
