// src/app/patient/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../DetailsPatient.module.css";
import { patientsMock, Patient } from "../../../mocks/patients";

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR");
};

export default function DetailsPatientPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = patientsMock.find((p) => p.id === idParam) || null;
      setPatient(found);
    }
  }, [idParam]);

  if (!patient) return <p>Paciente não encontrado ou carregando...</p>;

  return (
    <div className={styles.patientDetailsContainer}>
      <h1>Detalhes do Paciente</h1>

      <p>
        <strong>Nome:</strong> {patient.name}
      </p>
      <p>
        <strong>Data de Nascimento:</strong> {formatDate(patient.dateOfBirth)}
      </p>
      <p>
        <strong>Sexo:</strong> {patient.gender}
      </p>
      <p>
        <strong>Telefone:</strong> {patient.phone || "-"}
      </p>
      <p>
        <strong>Email:</strong> {patient.email || "-"}
      </p>

      <div className={styles.actions}>
        <button
          className={styles.edit}
          onClick={() => router.push(`/patient/edit/${patient.id}`)}
        >
          Editar
        </button>
        <button className={styles.back} onClick={() => router.push("/patient")}>
          Voltar para a Lista
        </button>
      </div>
    </div>
  );
}
