// src/app/specialty/details/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../SpecialtyDetails.module.css";
import { specialtiesMock, Specialty } from "../../../mocks/specialties";

const DetailsSpecialtyPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const [specialty, setSpecialty] = useState<Specialty | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = specialtiesMock.find((s) => s.id === idParam) || null;
      setSpecialty(found);
    }
  }, [idParam]);

  const handleEdit = () => {
    if (specialty) router.push(`/specialty/edit/${specialty.id}`);
  };

  const handleBack = () => {
    router.push("/specialty");
  };

  if (!specialty) {
    return <p>Carregando especialidade...</p>;
  }

  return (
    <div className={styles.specialtyDetailsContainer}>
      <h1>Detalhes da Especialidade</h1>

      <p>
        <strong>ID:</strong> {specialty.id}
      </p>
      <p>
        <strong>Nome:</strong> {specialty.name}
      </p>

      <div className={styles.actions}>
        <button className={styles.edit} onClick={handleEdit}>
          Editar
        </button>
        <button className={styles.back} onClick={handleBack}>
          Voltar para a Lista
        </button>
      </div>
    </div>
  );
};

export default DetailsSpecialtyPage;
