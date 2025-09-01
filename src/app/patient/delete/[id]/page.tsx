// src/app/patient/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DeletePatient.module.css";
import { usePatient } from "../../../hooks/usePatient";
import { Patient } from "../../../types/Patient";

export default function DeletePatientPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { patients, deletePatient } = usePatient();
  const [patient, setPatient] = useState<Patient | null>(null);

  // Busca o paciente ao carregar ou quando a lista mudar
  useEffect(() => {
    if (idParam) {
      const foundPatient = patients.find(p => p.id === idParam) || null;
      setPatient(foundPatient);
    }
  }, [idParam, patients]);

  const handleDelete = () => {
    if (patient) {
      deletePatient(patient.id);
      console.log("Paciente excluído:", patient);
      router.push("/patient");
    }
  };

  const handleCancel = () => router.push("/patient");

  if (!patient) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Confirmar Exclusão</h1>
      <p>
        Tem certeza de que deseja excluir o paciente{" "}
        <strong>{patient.name}</strong>?
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
