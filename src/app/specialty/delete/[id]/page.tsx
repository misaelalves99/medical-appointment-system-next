"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";
import styles from "../DeleteSpecialty.module.css";
import { useSpecialty } from "../../../hooks/useSpecialty";
import { Specialty } from "../../../types/Specialty";

export default function DeleteSpecialtyPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { specialties, removeSpecialty } = useSpecialty();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);

  useEffect(() => {
    if (idParam) {
      const foundSpecialty = specialties.find((item) => item.id === idParam) || null;
      setSpecialty(foundSpecialty);
    }
  }, [idParam, specialties]);

  const handleDelete = () => {
    if (specialty) {
      removeSpecialty(specialty.id);
      console.log("Especialidade excluída:", specialty);
      router.push("/specialty");
    }
  };

  const handleCancel = () => {
    router.push("/specialty");
  };

  if (!specialty) {
    return <p className={styles.loading}>Carregando...</p>;
  }

  return (
    <section className={styles.workspace} aria-labelledby="delete-specialty-title">
      <article className={styles.dangerCard}>
        <div className={styles.warningIcon} aria-hidden="true">
          <FaExclamationTriangle />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>Ação destrutiva</p>
          <h1 id="delete-specialty-title">Confirmar Exclusão</h1>
          <p className={styles.confirmation}>
            Tem certeza de que deseja excluir a especialidade{" "}
            <strong>{specialty.name}</strong>?
          </p>

          <div className={styles.warningBox} role="note">
            Esta ação remove o registro do catálogo atual e não deve ser executada por engano.
          </div>

          <dl className={styles.contextGrid}>
            <div>
              <dt>ID do registro</dt>
              <dd>#{specialty.id}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="button" onClick={handleDelete} className={styles.deleteButton}>
              Excluir
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
