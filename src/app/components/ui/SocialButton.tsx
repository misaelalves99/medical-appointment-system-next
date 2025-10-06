// app/components/ui/SocialButton.tsx
'use client';

import React from 'react';
import { IconType } from 'react-icons';
import styles from './SocialButton.module.css';

interface Props {
  icon: IconType;
  color?: string; // cor de fundo do botão
  onClick?: () => void;
}

export default function SocialButton({ icon: Icon, color, onClick }: Props) {
  return (
    <button
      type="button"
      className={styles.socialBtn}
      style={{ backgroundColor: color || '#2A9DDA' }}
      onClick={onClick}
    >
      <Icon className={styles.icon} />
    </button>
  );
}
