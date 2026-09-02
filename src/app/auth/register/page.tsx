// app/auth/register/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth';
import SocialButton from '@/app/components/ui/SocialButton';
import styles from '../AuthForm.module.css';

export default function RegisterPage() {
  const { register, loginWithGoogle, loginWithFacebook, mapAuthError } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mapError = useMemo(
    () => mapAuthError ?? ((code?: string) => {
      switch (code) {
        case 'auth/invalid-email': return 'E-mail invÃ¡lido.';
        case 'auth/email-already-in-use': return 'Este e-mail jÃ¡ estÃ¡ cadastrado.';
        case 'auth/weak-password': return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/unauthorized-domain': return 'DomÃ­nio nÃ£o autorizado nas configuraÃ§Ãµes do Firebase.';
        default: return 'NÃ£o foi possÃ­vel criar a conta. Tente novamente.';
      }
    }),
    [mapAuthError]
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const nameTrim = name.trim();
    const emailTrim = email.trim();
    const passTrim = password.trim();

    if (!nameTrim || !emailTrim || !passTrim) { setErrorMsg('Preencha nome, e-mail e senha.'); return; }
    if (passTrim.length < 6) { setErrorMsg('A senha deve ter no mÃ­nimo 6 caracteres.'); return; }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const ok = await register(nameTrim, emailTrim, passTrim);
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

  const disabled = submitting || !name.trim() || !email.trim() || password.trim().length < 6;

  return (
    <div className={styles.container}>
      <div className={styles.imageSide}>
        <div className={styles.overlay}>
          <h2 className={styles.welcomeTitle}>Movendo a empresa para frente</h2>
          <p className={styles.welcomeText}>Priorizando eficiÃªncia, inovaÃ§Ã£o e confianÃ§a em cada aÃ§Ã£o.</p>
        </div>
        <img src="/assets/auth-banner.png" alt="Registro" />
      </div>

      <div className={styles.formSide}>
        <h1 className={styles.title}>Criar Conta</h1>
        <p className={styles.subtitle}>Cadastre-se para comeÃ§ar a gerenciar suas consultas.</p>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleRegister} className={styles.form} noValidate>
          <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input} autoComplete="name" aria-label="Nome completo" />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} autoComplete="email" inputMode="email" aria-label="E-mail" />
          <input type="password" placeholder="Senha (mÃ­n. 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} autoComplete="new-password" aria-label="Senha" minLength={6} />
          <button type="submit" className={styles.btnPrimary} disabled={disabled}>
            {submitting ? 'Registrandoâ€¦' : 'Registrar'}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <div className={styles.socialButtons}>
          <SocialButton icon={FaGoogle} color="#DB4437" ariaLabel="Entrar com Google" onClick={social(loginWithGoogle)} disabled={submitting} />
          <SocialButton icon={FaFacebookF} color="#1877F2" ariaLabel="Entrar com Facebook" onClick={social(loginWithFacebook)} disabled={submitting} />
        </div>

        <p className={styles.text}>
          JÃ¡ possui conta? <Link href="/auth/login" className={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
