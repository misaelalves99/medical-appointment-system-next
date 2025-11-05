// app/components/ui/SocialButton.tsx
'use client';

import { IconType } from 'react-icons';
import styles from './SocialButton.module.css';

interface Props {
  icon: IconType;
  color: string;
  onClick?: () => void | Promise<void>;
  ariaLabel: string;
  disabled?: boolean;
}

export default function SocialButton({ icon: Icon, color, onClick, ariaLabel, disabled }: Props) {
  return (
    <button
      type="button"
      className={styles.socialBtn}
      style={{ backgroundColor: color, opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <Icon className={styles.icon} />
    </button>
  );
}
