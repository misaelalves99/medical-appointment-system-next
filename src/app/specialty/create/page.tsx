// src/app/specialty/create/page.tsx

"use client";

import { useState } from "react";
import styles from "./CreateSpecialty.module.css";
import { specialtiesMock, Specialty } from "../../mocks/specialties";

const CreateSpecialtyPage: React.FC = () => {
  const [name, setName] = useState("");

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
    console.log("Lista atualizada:", specialtiesMock);

    setName("");
  };

  return (
    <div className={styles.createSpecialtyContainer}>
      <h1>Cadastrar Nova Especialidade</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="specialtyName">Nome da Especialidade:</label>
          <input
            id="specialtyName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default CreateSpecialtyPage;
