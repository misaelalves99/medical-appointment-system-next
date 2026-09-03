"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { usePatient } from "../../../hooks/usePatient";
import type { Patient } from "../../../types/Patient";
import styles from "../DeletePatient.module.css";

export default function DeletePatientPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;
  const { patients, deletePatient } = usePatient();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (idParam) {
      const foundPatient = patients.find((item) => item.id === idParam) || null;
      setPatient(foundPatient);
    }
  }, [idParam, patients]);

  const handleDelete = () => {
    if (patient) {
      deletePatient(patient.id);
      router.push("/patient");
    }
  };

  const handleCancel = () => router.push("/patient");

  if (!patient) {
    return <p className={styles.loading}>Carregando...</p>;
  }

  return (
    <section className={styles.workspace} aria-labelledby="delete-patient-title">
      <div className={styles.dangerCard}>
        <div className={styles.warningIcon} aria-hidden="true">
          <FaExclamationTriangle />
        </div>

        <p className={styles.eyebrow}>Ação destrutiva</p>
        <h1 id="delete-patient-title">Confirmar Exclusão</h1>

        <p className={styles.confirmationText}>
          Tem certeza de que deseja excluir o paciente <strong>{patient.name}</strong>?
        </p>

        <div className={styles.warningBox}>
          <strong>Esta ação exige confirmação.</strong>
          <p>O cadastro selecionado será removido da lista atual de pacientes.</p>
        </div>

        <dl className={styles.patientIdentity}>
          <div>
            <dt>Paciente</dt>
            <dd>{patient.name}</dd>
          </div>
          <div>
            <dt>Identificador</dt>
            <dd>#{patient.id}</dd>
          </div>
          <div>
            <dt>CPF</dt>
            <dd>{patient.cpf || "-"}</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="button" onClick={handleDelete} className={styles.deleteButton}>
            <FaTrash aria-hidden="true" />
            Excluir
          </button>
        </div>
      </div>
    </section>
  );
}
