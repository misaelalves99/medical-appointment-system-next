// src/app/patient/delete/page.tsx

"use client";

import styles from "./DeletePatient.module.css";

interface PatientDeleteProps {
  id: number;
  name: string;
  onDelete: (id: number) => void;
  onCancel: () => void;
}

const DeletePatient: React.FC<PatientDeleteProps> = ({ id, name, onDelete, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete(id);
  };

  return (
    <div className={styles.deletePatientContainer}>
      <h1>Confirmar Exclusão</h1>
      <p>
        Tem certeza de que deseja excluir o paciente <strong>{name}</strong>?
      </p>

      <form onSubmit={handleSubmit}>
        <button type="submit" className={styles.btnDelete}>
          Excluir
        </button>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default DeletePatient;
