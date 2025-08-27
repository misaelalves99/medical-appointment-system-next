// src/app/specialty/create/page.tsx

"use client";

import { useState } from "react";
import styles from "./CreateSpecialty.module.css";
import { specialtiesMock, Specialty } from "../../mocks/specialties";
import { useRouter } from "next/navigation";

const CreateSpecialtyPage: React.FC = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Simula adicionar ao mock
    const newSpecialty: Specialty = {
      id: specialtiesMock.length
        ? specialtiesMock[specialtiesMock.length - 1].id + 1
        : 1,
      name: name.trim(),
    };
    specialtiesMock.push(newSpecialty);

    console.log("Especialidade adicionada:", newSpecialty);

    setName("");
    router.push("/specialty"); // redireciona após salvar
  };

  return (
    <div className={styles.createSpecialtyContainer}>
      <h1>Cadastrar Nova Especialidade</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="specialtyName">Nome da Especialidade</label>
          <input
            id="specialtyName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Digite o nome da especialidade"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Salvar
        </button>
      </form>
    </div>
  );
};

export default CreateSpecialtyPage;
