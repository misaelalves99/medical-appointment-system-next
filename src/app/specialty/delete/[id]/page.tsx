// src/app/specialty/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../DeleteSpecialty.module.css";
import { specialtiesMock, Specialty } from "../../../mocks/specialties";

const DeleteSpecialtyPage: React.FC = () => {
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

  const handleDelete = () => {
    if (!specialty) return;

    const index = specialtiesMock.findIndex((s) => s.id === specialty.id);
    if (index !== -1) specialtiesMock.splice(index, 1);

    console.log("Especialidade excluída:", specialty);
    console.log("Lista atualizada:", specialtiesMock);

    router.push("/specialty");
  };

  const handleCancel = () => {
    router.push("/specialty");
  };

  if (!specialty) {
    return <p>Carregando especialidade...</p>;
  }

  return (
    <div className={styles.deleteSpecialtyContainer}>
      <h1>Excluir Especialidade</h1>
      <h4>Tem certeza que deseja excluir esta especialidade?</h4>

      <div>
        <strong>ID:</strong> {specialty.id}
        <br />
        <strong>Nome:</strong> {specialty.name}
      </div>

      <div className={styles.actions}>
        <button onClick={handleDelete}>Excluir</button>
        <button onClick={handleCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default DeleteSpecialtyPage;
