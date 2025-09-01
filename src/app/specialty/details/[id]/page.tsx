// src/app/specialty/details/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../SpecialtyDetails.module.css";
import { useSpecialty } from "../../../hooks/useSpecialty";
import { Specialty } from "../../../types/Specialty";

export default function DetailsSpecialtyPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { specialties } = useSpecialty();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = specialties.find((s) => s.id === idParam) || null;
      setSpecialty(found);
    }
  }, [idParam, specialties]);

  const handleEdit = () => {
    if (specialty) router.push(`/specialty/edit/${specialty.id}`);
  };

  const handleBack = () => {
    router.push("/specialty");
  };

  if (!specialty) {
    return (
      <div className={styles.specialtyDetailsContainer}>
        <h1>Detalhes da Especialidade</h1>
        <p>Especialidade não encontrada.</p>
        <button className={styles.back} onClick={handleBack}>
          Voltar para a Lista
        </button>
      </div>
    );
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
}
