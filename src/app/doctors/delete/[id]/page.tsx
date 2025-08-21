// src/app/doctors/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DeleteDoctor.module.css";

export interface Doctor {
  id: number;
  name: string;
  crm: string;
  specialty: string;
  email: string;
  phone: string;
  isActive: boolean;
}

// Mock de médicos
const doctorsMock: Doctor[] = [
  { id: 1, name: "Dr. João", crm: "12345", specialty: "Cardiologia", email: "joao@email.com", phone: "9999-9999", isActive: true },
  { id: 2, name: "Dra. Maria", crm: "67890", specialty: "Pediatria", email: "maria@email.com", phone: "8888-8888", isActive: false },
];

export default function DeleteDoctor() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (idParam) {
      const foundDoctor = doctorsMock.find((d) => d.id === idParam) || null;
      setDoctor(foundDoctor);
    }
  }, [idParam]);

  const handleDelete = () => {
    if (doctor) {
      const index = doctorsMock.findIndex((d) => d.id === doctor.id);
      if (index !== -1) {
        doctorsMock.splice(index, 1);
      }
      console.log("Médico excluído:", doctor);
      console.log("Lista atualizada:", doctorsMock);
      router.push("/doctors");
    }
  };

  const handleCancel = () => {
    router.push("/doctors");
  };

  if (!doctor) {
    return <p>Carregando médico...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Médico</h1>
      <h3 className={styles.subtitle}>Tem certeza que deseja excluir o médico abaixo?</h3>

      <dl className={styles.detailsList}>
        <dt className={styles.dt}>Nome</dt>
        <dd className={styles.dd}>{doctor.name}</dd>

        <dt className={styles.dt}>CRM</dt>
        <dd className={styles.dd}>{doctor.crm}</dd>

        <dt className={styles.dt}>Especialidade</dt>
        <dd className={styles.dd}>{doctor.specialty}</dd>

        <dt className={styles.dt}>Email</dt>
        <dd className={styles.dd}>{doctor.email}</dd>

        <dt className={styles.dt}>Telefone</dt>
        <dd className={styles.dd}>{doctor.phone}</dd>

        <dt className={styles.dt}>Ativo</dt>
        <dd className={styles.dd}>{doctor.isActive ? "Sim" : "Não"}</dd>
      </dl>

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
