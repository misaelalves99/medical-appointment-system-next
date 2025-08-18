// src/app/specialty/create/page.tsx

"use client";

import { useState } from "react";
import styles from "./CreateSpecialty.module.css";

interface CreateSpecialtyProps {
  onSubmit: (name: string) => void;
}

const CreateSpecialty: React.FC<CreateSpecialtyProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
    }
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

export default CreateSpecialty;
