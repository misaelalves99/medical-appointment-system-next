// src/components/Error.tsx

"use client";

import Link from "next/link";
import styles from "./Error.module.css";

export default function Error() {
  return (
    <div className={styles.errorContainer}>
      <h1>Ocorreu um erro</h1>
      <p>Desculpe, ocorreu um erro ao processar sua solicitação.</p>
      <Link href="/">Voltar para a Home</Link>
    </div>
  );
}
