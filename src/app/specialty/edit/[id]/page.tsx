"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import styles from "../EditSpecialty.module.css";
import { useSpecialty } from "../../../hooks/useSpecialty";

export default function EditSpecialtyPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const { specialties, updateSpecialty } = useSpecialty();

  const specialty = specialties.find((item) => item.id === Number(id));

  const [name, setName] = useState(specialty?.name || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (specialty) {
      setName(specialty.name);
    }
  }, [specialty]);

  if (!specialty) {
    return (
      <section className={styles.workspace} aria-labelledby="specialty-not-found-title">
        <div className={styles.notFoundCard}>
          <p className={styles.eyebrow}>Catálogo clínico</p>
          <h1 id="specialty-not-found-title">Especialidade não encontrada.</h1>
          <p>
            O registro solicitado não está disponível no catálogo atual.
          </p>
          <button
            type="button"
            className={styles.buttonBack}
            onClick={() => router.push("/specialty")}
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("O nome da especialidade é obrigatório.");
      return;
    }

    setError(null);
    updateSpecialty(specialty.id, normalizedName);
    router.push("/specialty");
  };

  return (
    <section className={styles.workspace} aria-labelledby="edit-specialty-title">
      <button
        type="button"
        className={styles.backLink}
        onClick={() => router.push("/specialty")}
      >
        <FaArrowLeft aria-hidden="true" />
        Voltar
      </button>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Catálogo clínico</p>
        <h1 id="edit-specialty-title" className={styles.title}>
          Editar Especialidade
        </h1>
        <p className={styles.description}>
          Atualize o nome utilizado para identificar esta especialidade no sistema.
        </p>
      </header>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.identity}>
          <span>Registro</span>
          <strong>#{specialty.id}</strong>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="specialtyName">
            Nome da Especialidade:
          </label>
          <input
            id="specialtyName"
            type="text"
            className={styles.formInput}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-describedby={error ? "specialty-name-error" : undefined}
            aria-invalid={error ? true : undefined}
            required
          />
          {error && (
            <span
              id="specialty-name-error"
              className={styles.textDanger}
              role="alert"
            >
              {error}
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.buttonSave}>
            <FaSave aria-hidden="true" />
            Salvar Alterações
          </button>
          <button
            type="button"
            className={styles.buttonBack}
            onClick={() => router.push("/specialty")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
