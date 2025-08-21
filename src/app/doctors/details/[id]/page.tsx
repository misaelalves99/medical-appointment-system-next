// src/app/doctors/details/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../DoctorDetails.module.css";
import { doctorsMock, Doctor } from "../../../mocks/doctors";

export default function DoctorDetailsPage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id ? Number(params.id) : undefined;

  useEffect(() => {
    if (idParam) {
      const found = doctorsMock.find((d) => d.id === idParam) || null;
      setDoctor(found);
    }
  }, [idParam]);

  if (!doctor) {
    return <p>Carregando ou médico não encontrado...</p>;
  }

  const handleEdit = (id: number) => {
    router.push(`/doctors/edit/${id}`);
  };

  const handleBack = () => {
    router.push("/doctors");
  };

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
        <button className={styles.edit} onClick={() => handleEdit(doctor.id)}>
          Editar
        </button>
        <button className={styles.back} onClick={handleBack}>
          Voltar
        </button>
      </div>
    </div>
  );
}
