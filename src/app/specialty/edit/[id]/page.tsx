// src/app/specialty/edit/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../EditSpecialty.module.css";
import { specialtiesMock, Specialty } from "../../../mocks/specialties";

const EditSpecialtyPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<Specialty | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = specialtiesMock.find((s) => s.id === idParam) || null;
      if (found) setName(found.name);
      setSpecialty(found);
    }
  }, [idParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialty) return;

    if (name.trim() === "") {
      setError("O nome da especialidade é obrigatório.");
      return;
    }

    setError(null);

    // Atualiza mock
    const idx = specialtiesMock.findIndex((s) => s.id === specialty.id);
    if (idx !== -1) specialtiesMock[idx].name = name.trim();

    router.push("/specialty");
  };

  const handleBack = () => {
    router.push("/specialty");
  };

  if (!specialty) return <p>Carregando especialidade...</p>;

  return (
    <div className={styles.editSpecialtyContainer}>
      <h1>Editar Especialidade</h1>

      <form onSubmit={handleSubmit}>
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

      <button className="btn btn-secondary mt-3" onClick={handleBack}>
        Voltar
      </button>
    </div>
  );
};

export default EditSpecialtyPage;
