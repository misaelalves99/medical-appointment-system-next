// src/app/specialty/details/[id]/page.tsx

"use client";

import { useRouter } from "next/navigation";
import styles from "../SpecialtyDetails.module.css";

interface DetailsSpecialtyProps {
  id: number;
  name: string;
}

const DetailsSpecialty: React.FC<DetailsSpecialtyProps> = ({ id, name }) => {
  const router = useRouter();

  return (
    <div className={styles.specialtyDetailsContainer}>
      <h1>Detalhes da Especialidade</h1>

      <p>
        <strong>ID:</strong> {id}
      </p>
      <p>
        <strong>Nome:</strong> {name}
      </p>

      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => router.push(`/specialty/edit/${id}`)}>
          Editar
        </button>
        <button className={styles.back} onClick={() => router.push("/specialty")}>
          Voltar para a Lista
        </button>
      </div>
    </div>
  );
};

export default DetailsSpecialty;
