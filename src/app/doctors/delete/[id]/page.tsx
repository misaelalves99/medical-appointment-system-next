"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaTriangleExclamation } from "react-icons/fa6";
import styles from "../DeleteDoctor.module.css";
import { useDoctor } from "../../../hooks/useDoctor";
import type { Doctor } from "../../../types/Doctor";

export default function DeleteDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;
  const { doctors, removeDoctor } = useDoctor();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (idParam) {
      const foundDoctor = doctors.find((item) => item.id === idParam) || null;
      setDoctor(foundDoctor);
    }
  }, [idParam, doctors]);

  const handleDelete = () => {
    if (doctor) {
      removeDoctor(doctor.id);
      router.push("/doctors");
    }
  };

  const handleCancel = () => router.push("/doctors");

  if (!doctor) {
    return <p className={styles.loading}>Carregando...</p>;
  }

  return (
    <section className={styles.workspace} aria-labelledby="delete-doctor-title">
      <article className={styles.dangerCard}>
        <div className={styles.warningIcon} aria-hidden="true">
          <FaTriangleExclamation />
        </div>

        <p className={styles.eyebrow}>Ação destrutiva</p>
        <h1 id="delete-doctor-title">Confirmar Exclusão</h1>
        <p className={styles.confirmation}>
          Tem certeza de que deseja excluir o doutor <strong>{doctor.name}</strong>?
        </p>

        <div className={styles.warningBox}>
          Esta ação remove o médico da lista atual e não deve ser executada por engano.
        </div>

        <dl className={styles.identityGrid}>
          <div><dt>Médico</dt><dd>{doctor.name}</dd></div>
          <div><dt>CRM</dt><dd>{doctor.crm}</dd></div>
          <div><dt>Especialidade</dt><dd>{doctor.specialty}</dd></div>
        </dl>

        <div className={styles.actions}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="button" onClick={handleDelete} className={styles.deleteButton}>
            Excluir
          </button>
        </div>
      </article>
    </section>
  );
}
