// src/app/patient/details/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DetailsPatient.module.css";
import { usePatient } from "../../../hooks/usePatient";
import type { Patient } from "../../../types/Patient";

export default function DetailsPatient() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;
  const { patients } = usePatient();

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = patients.find((p) => p.id === idParam) || null;
      setPatient(found);
    }
  }, [idParam, patients]);

  const handleEdit = () => {
    if (patient) router.push(`/patient/edit/${patient.id}`);
  };

  const handleBack = () => {
    router.push("/patient");
  };

  if (!patient) {
    return (
      <div className={styles.patientDetailsContainer}>
        <h1>Detalhes do Paciente</h1>
        <p>Paciente não encontrado.</p>
        <button className={styles.back} onClick={handleBack}>
          Voltar para a Lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.patientDetailsContainer}>
      <h1>Detalhes do Paciente</h1>

      <p><strong>Nome:</strong> {patient.name}</p>
      <p><strong>CPF:</strong> {patient.cpf || "-"}</p>
      <p><strong>Data de Nascimento:</strong> {new Date(patient.dateOfBirth).toLocaleDateString("pt-BR")}</p>
      <p><strong>Sexo:</strong> {patient.gender || "-"}</p>
      <p><strong>Telefone:</strong> {patient.phone || "-"}</p>
      <p><strong>Email:</strong> {patient.email || "-"}</p>
      <p><strong>Endereço:</strong> {patient.address || "-"}</p>

      <div className={styles.actions}>
        <button className={styles.edit} onClick={handleEdit}>Editar</button>
        <button className={styles.back} onClick={handleBack}>Voltar para a Lista</button>
      </div>
    </div>
  );
}
