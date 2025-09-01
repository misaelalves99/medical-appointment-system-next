// src/app/doctors/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DeleteDoctor.module.css";
import { useDoctor } from "../../../hooks/useDoctor";
import { Doctor } from "../../../types/Doctor";

export default function DeleteDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { doctors, removeDoctor } = useDoctor();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Busca o médico ao carregar ou quando a lista mudar
  useEffect(() => {
    if (idParam) {
      const foundDoctor = doctors.find(d => d.id === idParam) || null;
      setDoctor(foundDoctor);
    }
  }, [idParam, doctors]);

  const handleDelete = () => {
    if (doctor) {
      removeDoctor(doctor.id);
      console.log("Médico excluído:", doctor);
      router.push("/doctors");
    }
  };

  const handleCancel = () => router.push("/doctors");

  if (!doctor) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>Confirmar Exclusão</h1>
      <p>
        Tem certeza de que deseja excluir o doutor{" "}
        <strong>{doctor.name}</strong>?
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
