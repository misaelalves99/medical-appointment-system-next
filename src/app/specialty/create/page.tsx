"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import styles from "./CreateSpecialty.module.css";
import { useSpecialty } from "../../hooks/useSpecialty";

export default function CreateSpecialtyPage() {
  const { addSpecialty } = useSpecialty();
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      return;
    }

    addSpecialty(normalizedName);
    setName("");
    router.push("/specialty");
  };

  return (
    <section className={styles.workspace} aria-labelledby="create-specialty-title">
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
        <h1 id="create-specialty-title" className={styles.title}>
          Cadastrar Nova Especialidade
        </h1>
        <p className={styles.description}>
          Adicione uma especialidade ao catálogo utilizado pela operação clínica.
        </p>
      </header>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="specialtyName">
            Nome da Especialidade:
          </label>
          <input
            className={styles.formInput}
            id="specialtyName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
            required
          />
          <p className={styles.helperText}>
            Use o nome clínico que será reconhecido na operação do sistema.
          </p>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.buttonSave}>
            <FaSave aria-hidden="true" />
            Salvar
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
