// src/app/specialty/create/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateSpecialty.module.css";
import { useSpecialty } from "../../hooks/useSpecialty";

export default function CreateSpecialtyPage() {
  const { addSpecialty } = useSpecialty();
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addSpecialty(name.trim());
      setName("");
      router.push("/specialty");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastrar Nova Especialidade</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="specialtyName">
            Nome da Especialidade:
          </label>
          <input
            className={styles.formInput}
            id="specialtyName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.buttonSave}>
            Salvar
          </button>
          <button
            type="button"
            className={styles.buttonBack}
            onClick={() => router.push("/specialty")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
