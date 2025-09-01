// src/app/specialty/delete/[id]/page.tsx

// src/app/specialty/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DeleteSpecialty.module.css";
import { useSpecialty } from "../../../hooks/useSpecialty";
import { Specialty } from "../../../types/Specialty";

export default function DeleteSpecialtyPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { specialties, removeSpecialty } = useSpecialty();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);

  // Busca a especialidade ao carregar ou quando a lista mudar
  useEffect(() => {
    if (idParam) {
      const foundSpecialty = specialties.find(s => s.id === idParam) || null;
      setSpecialty(foundSpecialty);
    }
  }, [idParam, specialties]);

  const handleDelete = () => {
    if (specialty) {
      removeSpecialty(specialty.id);
      console.log("Especialidade excluída:", specialty);
      router.push("/specialty");
    }
  };

  const handleCancel = () => router.push("/specialty");

  if (!specialty) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Confirmar Exclusão</h1>
      <p>
        Tem certeza de que deseja excluir a especialidade{" "}
        <strong>{specialty.name}</strong>?
      </p>

      <div className={styles.actions}>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Excluir
        </button>
        <button onClick={handleCancel} className={styles.cancelButton}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
