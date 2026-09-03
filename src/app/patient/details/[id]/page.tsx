"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit, FaUser } from "react-icons/fa";
import { usePatient } from "../../../hooks/usePatient";
import type { Patient } from "../../../types/Patient";
import styles from "../DetailsPatient.module.css";

export default function DetailsPatient() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;
  const { patients } = usePatient();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = patients.find((item) => item.id === idParam) || null;
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
      <section className={styles.workspace} aria-labelledby="patient-details-title">
        <div className={styles.notFoundCard}>
          <p className={styles.eyebrow}>Cadastro clínico</p>
          <h1 id="patient-details-title">Detalhes do Paciente</h1>
          <p>Paciente não encontrado.</p>
          <button type="button" className={styles.secondaryButton} onClick={handleBack}>
            <FaArrowLeft aria-hidden="true" />
            Voltar para a Lista
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.workspace} aria-labelledby="patient-details-title">
      <button type="button" className={styles.backLink} onClick={handleBack}>
        <FaArrowLeft aria-hidden="true" />
        Voltar para a Lista
      </button>

      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Cadastro clínico</p>
          <h1 id="patient-details-title">Detalhes do Paciente</h1>
          <p className={styles.description}>
            Consulte as informações cadastrais registradas para {patient.name}.
          </p>
        </div>

        <button type="button" className={styles.editButton} onClick={handleEdit}>
          <FaEdit aria-hidden="true" />
          Editar
        </button>
      </div>

      <div className={styles.detailsCard}>
        <div className={styles.identityHeader}>
          <div className={styles.identityIcon} aria-hidden="true">
            <FaUser />
          </div>
          <div>
            <p className={styles.identityLabel}>Paciente</p>
            <h2>{patient.name}</h2>
            <p className={styles.identityId}>Identificador #{patient.id}</p>
          </div>
        </div>

        <dl className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <dt>Nome</dt>
            <dd>{patient.name}</dd>
          </div>

          <div className={styles.detailItem}>
            <dt>CPF</dt>
            <dd>{patient.cpf || "-"}</dd>
          </div>

          <div className={styles.detailItem}>
            <dt>Data de Nascimento</dt>
            <dd>{new Date(patient.dateOfBirth).toLocaleDateString("pt-BR")}</dd>
          </div>

          <div className={styles.detailItem}>
            <dt>Sexo</dt>
            <dd>{patient.gender || "-"}</dd>
          </div>

          <div className={styles.detailItem}>
            <dt>Telefone</dt>
            <dd>{patient.phone || "-"}</dd>
          </div>

          <div className={styles.detailItem}>
            <dt>Email</dt>
            <dd>{patient.email || "-"}</dd>
          </div>

          <div className={`${styles.detailItem} ${styles.fullWidth}`}>
            <dt>Endereço</dt>
            <dd>{patient.address || "-"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
