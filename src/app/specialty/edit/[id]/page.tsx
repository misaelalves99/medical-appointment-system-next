// src/app/specialty/edit/[id]/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../EditSpecialty.module.css";
import { useSpecialty } from "../../../hooks/useSpecialty";

export default function EditSpecialtyPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const { specialties, updateSpecialty } = useSpecialty();

  const specialty = specialties.find((s) => s.id === Number(id));

  const [name, setName] = useState(specialty?.name || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (specialty) setName(specialty.name);
  }, [specialty]);

  if (!specialty) return <p>Especialidade não encontrada.</p>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") {
      setError("O nome da especialidade é obrigatório.");
      return;
    }
    setError(null);
    updateSpecialty(specialty.id, name.trim());
    router.push("/specialty");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Especialidade</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="specialtyName">
            Nome da Especialidade:
          </label>
          <input
            id="specialtyName"
            type="text"
            className={styles.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <span className={styles.textDanger}>{error}</span>}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.buttonSave}>
            Salvar Alterações
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
