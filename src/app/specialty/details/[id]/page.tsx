"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import styles from "../SpecialtyDetails.module.css";
import { useSpecialty } from "../../../hooks/useSpecialty";
import { Specialty } from "../../../types/Specialty";

export default function DetailsSpecialtyPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { specialties } = useSpecialty();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = specialties.find((item) => item.id === idParam) || null;
      setSpecialty(found);
    }
  }, [idParam, specialties]);

  const handleEdit = () => {
    if (specialty) {
      router.push(`/specialty/edit/${specialty.id}`);
    }
  };

  const handleBack = () => {
    router.push("/specialty");
  };

  if (!specialty) {
    return (
      <section className={styles.workspace} aria-labelledby="specialty-not-found-title">
        <div className={styles.notFoundCard}>
          <p className={styles.eyebrow}>Catálogo clínico</p>
          <h1 id="specialty-not-found-title">Detalhes da Especialidade</h1>
          <p>Especialidade não encontrada.</p>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Voltar para a Lista
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.workspace} aria-labelledby="specialty-details-title">
      <button type="button" className={styles.backLink} onClick={handleBack}>
        <FaArrowLeft aria-hidden="true" />
        Voltar para a Lista
      </button>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Catálogo clínico</p>
          <h1 id="specialty-details-title">Detalhes da Especialidade</h1>
          <p className={styles.description}>
            Consulte as informações que identificam esta especialidade no sistema.
          </p>
        </div>

        <button type="button" className={styles.editButton} onClick={handleEdit}>
          <FaEdit aria-hidden="true" />
          Editar
        </button>
      </header>

      <article className={styles.detailsCard}>
        <div className={styles.identity}>
          <span className={styles.identityLabel}>Especialidade</span>
          <h2>{specialty.name}</h2>
        </div>

        <dl className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <dt>ID</dt>
            <dd>{specialty.id}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
