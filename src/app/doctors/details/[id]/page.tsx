"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaPen } from "react-icons/fa6";
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
      const foundDoctor = doctors.find((item) => item.id === idParam) || null;
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
      <section className={styles.workspace} aria-labelledby="doctor-details-title">
        <button type="button" className={styles.backLink} onClick={handleBack}>
          <FaArrowLeft aria-hidden="true" />
          Voltar para médicos
        </button>
        <div className={styles.emptyCard}>
          <p className={styles.eyebrow}>Equipe clínica</p>
          <h1 id="doctor-details-title">Detalhes do Médico</h1>
          <p>Médico não encontrado.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.workspace} aria-labelledby="doctor-details-title">
      <button type="button" className={styles.backLink} onClick={handleBack}>
        <FaArrowLeft aria-hidden="true" />
        Voltar para médicos
      </button>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Equipe clínica</p>
          <h1 id="doctor-details-title">Detalhes do Médico</h1>
          <p className={styles.description}>
            Consulte os dados profissionais e a disponibilidade do médico.
          </p>
        </div>
        <button type="button" className={styles.editAction} onClick={handleEdit}>
          <FaPen aria-hidden="true" />
          Editar
        </button>
      </header>

      <article className={styles.card}>
        <div className={styles.identity}>
          <div>
            <span className={styles.identityLabel}>Médico</span>
            <h2>{doctor.name}</h2>
            <p>Identificador #{doctor.id}</p>
          </div>
          <span
            className={doctor.isActive ? styles.activeBadge : styles.inactiveBadge}
          >
            {doctor.isActive ? "Ativo" : "Inativo"}
          </span>
        </div>

        <dl className={styles.detailsGrid}>
          <div><dt>Nome</dt><dd>{doctor.name}</dd></div>
          <div><dt>CRM</dt><dd>{doctor.crm}</dd></div>
          <div><dt>Especialidade</dt><dd>{doctor.specialty}</dd></div>
          <div><dt>Email</dt><dd>{doctor.email}</dd></div>
          <div><dt>Telefone</dt><dd>{doctor.phone}</dd></div>
          <div><dt>Ativo</dt><dd>{doctor.isActive ? "Sim" : "Não"}</dd></div>
        </dl>
      </article>
    </section>
  );
}
