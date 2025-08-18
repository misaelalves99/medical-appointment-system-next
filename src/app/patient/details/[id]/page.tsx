// src/app/patient/[id]/page.tsx

"use client";

import { useRouter } from "next/navigation";
import styles from "./DetailsPatient.module.css";

interface PatientDetailsProps {
  patient: {
    id: number;
    name: string;
    dateOfBirth: string; // ISO date string
    gender: string;
    phone?: string;
    email?: string;
    // profilePicturePath?: string; // Uncomment if using photo
  };
}

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR");
};

interface DetailsPatientPageProps {
  params: { id: string }; // Next.js dynamic route param
}

export default function DetailsPatientPage({ params }: DetailsPatientPageProps) {
  const router = useRouter();

  // Simulação de paciente — substituir por fetch real se necessário
  const patient: PatientDetailsProps["patient"] = {
    id: Number(params.id),
    name: "João da Silva",
    dateOfBirth: "2000-01-15",
    gender: "Masculino",
    phone: "9999-9999",
    email: "joao@email.com",
  };

  return (
    <div className={styles.patientDetailsContainer}>
      <h1>Detalhes do Paciente</h1>

      {/* Exemplo imagem se quiser usar */}
      {/* {patient.profilePicturePath && (
        <img
          src={patient.profilePicturePath}
          alt="Foto do Paciente"
          className={styles.profileImage}
        />
      )} */}

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
