// app/auth/login/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth';
import SocialButton from '@/app/components/ui/SocialButton';
import styles from '../AuthForm.module.css';

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook, mapAuthError } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mapError = useMemo(
    () => mapAuthError ?? ((code?: string) => {
      switch (code) {
        case 'auth/invalid-email': return 'E-mail invÃ¡lido.';
        case 'auth/user-not-found': return 'UsuÃ¡rio nÃ£o encontrado.';
        case 'auth/wrong-password':
        case 'auth/invalid-credential': return 'E-mail ou senha incorretos.';
        case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
        case 'auth/unauthorized-domain': return 'DomÃ­nio nÃ£o autorizado nas configuraÃ§Ãµes do Firebase.';
        default: return 'Falha na autenticaÃ§Ã£o. Tente novamente.';
      }
    }),
    [mapAuthError]
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const emailTrim = email.trim();
    const passTrim = password.trim();
    if (!emailTrim || !passTrim) { setErrorMsg('Preencha e-mail e senha.'); return; }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const ok = await login(emailTrim, passTrim);
      if (ok) router.push('/'); else setErrorMsg(mapError());
    } catch (err: unknown) { setErrorMsg(mapError(err instanceof FirebaseError ? err.code : undefined)); } finally { setSubmitting(false); }
  };

  const social = (fn: () => Promise<boolean>) => async () => {
    if (submitting) return;
    setSubmitting(true); setErrorMsg(null);
    try { const ok = await fn(); if (ok) router.push('/'); else setErrorMsg(mapError()); }
    catch (err: unknown) { setErrorMsg(mapError(err instanceof FirebaseError ? err.code : undefined)); }
    finally { setSubmitting(false); }
  };

  const disabled = submitting || !email.trim() || !password.trim();

  return (
    <div className={styles.container}>
      <div className={styles.imageSide}>
        <div className={styles.overlay}>
          <h2 className={styles.welcomeTitle}>Movendo a empresa para frente</h2>
          <p className={styles.welcomeText}>Priorizando eficiÃªncia, inovaÃ§Ã£o e confianÃ§a em cada aÃ§Ã£o.</p>
        </div>
        <img src="/assets/auth-banner.png" alt="Sistema MÃ©dico" />
      </div>

      <div className={styles.formSide}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Bem-vindo! Entre na sua conta ou registre-se para comeÃ§ar.</p>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleLogin} className={styles.form} noValidate>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            autoComplete="email"
            inputMode="email"
            aria-label="E-mail"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            autoComplete="current-password"
            aria-label="Senha"
          />
          <button type="submit" className={styles.btnPrimary} disabled={disabled}>
            {submitting ? 'Entrandoâ€¦' : 'Entrar'}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <div className={styles.socialButtons}>
          <SocialButton icon={FaGoogle} color="#DB4437" ariaLabel="Entrar com Google" onClick={social(loginWithGoogle)} disabled={submitting} />
          <SocialButton icon={FaFacebookF} color="#1877F2" ariaLabel="Entrar com Facebook" onClick={social(loginWithFacebook)} disabled={submitting} />
        </div>

        <p className={styles.text}>
          NÃ£o tem uma conta? <Link href="/auth/register" className={styles.link}>Registre-se</Link>
        </p>
      </div>
    </div>
  );
}
