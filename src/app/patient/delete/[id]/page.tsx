// src/app/patient/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../DeletePatient.module.css";
import { patientsMock, Patient } from "../../../mocks/patients";

export default function DeletePatientPage() {
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

  const handleDelete = () => {
    if (!patient) return;

    const index = patientsMock.findIndex((p) => p.id === patient.id);
    if (index !== -1) {
      patientsMock.splice(index, 1); // remove do mock
      console.log("Paciente excluído:", patient);
      console.log("Lista atualizada:", patientsMock);
    }

    router.push("/patient"); // redireciona para listagem
  };

  const handleCancel = () => {
    router.push("/patient");
  };

  if (!patient) return <p>Carregando paciente...</p>;

  return (
    <div className={styles.deletePatientContainer}>
      <h1>Confirmar Exclusão</h1>
      <p>
        Tem certeza de que deseja excluir o paciente <strong>{patient.name}</strong>?
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
        <button type="submit" className={styles.btnDelete}>
          Excluir
        </button>
        <button type="button" className={styles.btnCancel} onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
