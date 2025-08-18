// src/app/specialty/delete/[id]/page.tsx

"use client";

import { useRouter } from "next/navigation";
import styles from "./DeleteSpecialty.module.css";

interface DeleteSpecialtyProps {
  id: number;
  name: string;
  onDelete: (id: number) => void;
}

const DeleteSpecialty: React.FC<DeleteSpecialtyProps> = ({ id, name, onDelete }) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete(id);
  };

  return (
    <div className={styles.deleteSpecialtyContainer}>
      <h1>Excluir Especialidade</h1>
      <h4>Tem certeza que deseja excluir esta especialidade?</h4>
      <div>
        <strong>ID:</strong> {id}
        <br />
        <strong>Nome:</strong> {name}
      </div>

      <form onSubmit={handleSubmit}>
        <button type="submit">Excluir</button>
        <button type="button" onClick={() => router.push("/specialty")}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default DeleteSpecialty;
