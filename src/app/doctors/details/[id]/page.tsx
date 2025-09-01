// src/app/doctors/details/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DoctorDetails.module.css";
import type { Doctor } from "../../../types/Doctor";
import { useDoctor } from "../../../hooks/useDoctor";

export default function DoctorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { doctors } = useDoctor();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (idParam) {
      const foundDoctor = doctors.find((d) => d.id === idParam) || null;
      setDoctor(foundDoctor);
    }
  }, [idParam, doctors]);

  const handleEdit = () => {
    if (doctor) router.push(`/doctors/edit/${doctor.id}`);
  };

  const handleBack = () => {
    router.push("/doctors");
  };

  if (!doctor) {
    return (
      <div className={styles.container}>
        <h1>Detalhes do Médico</h1>
        <p>Médico não encontrado.</p>
        <button className={styles.back} onClick={handleBack}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Detalhes do Médico</h1>

      <p><strong>Nome:</strong> {doctor.name}</p>
      <p><strong>CRM:</strong> {doctor.crm}</p>
      <p><strong>Especialidade:</strong> {doctor.specialty}</p>
      <p><strong>Email:</strong> {doctor.email}</p>
      <p><strong>Telefone:</strong> {doctor.phone}</p>
      <p><strong>Ativo:</strong> {doctor.isActive ? "Sim" : "Não"}</p>

      <div className={styles.actions}>
        <button className={styles.edit} onClick={handleEdit}>Editar</button>
        <button className={styles.back} onClick={handleBack}>Voltar</button>
      </div>
    </div>
  );
}
