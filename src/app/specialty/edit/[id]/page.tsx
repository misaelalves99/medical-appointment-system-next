// src/app/specialty/edit/[id]/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./EditSpecialty.module.css";

interface EditSpecialtyProps {
  id: number;
  initialName: string;
  onSubmit: (id: number, name: string) => void;
}

const EditSpecialty: React.FC<EditSpecialtyProps> = ({ id, initialName, onSubmit }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") {
      setError("O nome da especialidade é obrigatório.");
      return;
    }
    setError(null);
    onSubmit(id, name.trim());
  };

  return (
    <div className={styles.editSpecialtyContainer}>
      <h1>Editar Especialidade</h1>

      <form onSubmit={handleSubmit}>
        <input type="hidden" value={id} />
        <div>
          <label htmlFor="specialtyName">Nome da Especialidade:</label>
          <input
            id="specialtyName"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <span className={styles.textDanger}>{error}</span>}
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Salvar Alterações
        </button>
      </form>

      <button className="btn btn-secondary mt-3" onClick={() => router.push("/specialty")}>
        Voltar
      </button>
    </div>
  );
};

export default EditSpecialty;
