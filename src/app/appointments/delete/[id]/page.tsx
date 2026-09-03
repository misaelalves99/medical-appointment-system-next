// src/app/appointments/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DeleteAppointment.module.css";
import { useAppointments } from "../../../hooks/useAppointments";
import { Appointment } from "../../../types/Appointment";

export default function DeleteAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { appointments, deleteAppointment } = useAppointments();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = appointments.find((item) => item.id === idParam) || null;
      setAppointment(found);
    }
  }, [idParam, appointments]);

  const handleDelete = () => {
    if (appointment) {
      deleteAppointment(appointment.id);
      router.push("/appointments");
    }
  };

  const handleCancel = () => router.push("/appointments");

  if (!appointment) {
    return (
      <section className={styles.workspace} aria-labelledby="delete-not-found-title">
        <div className={styles.notFoundCard}>
          <p className={styles.eyebrow}>Agenda clínica</p>
          <h1 id="delete-not-found-title" className={styles.title}>
            Excluir Consulta
          </h1>
          <p className={styles.notFoundText}>Agendamento não encontrado.</p>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Voltar para consultas
          </button>
        </div>
      </section>
    );
  }

  const dt = new Date(appointment.appointmentDate);
  const formattedDate = dt.toLocaleDateString("pt-BR");
  const formattedTime = dt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className={styles.workspace} aria-labelledby="delete-appointment-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Agenda clínica</p>
          <h1 id="delete-appointment-title" className={styles.title}>
            Excluir Consulta
          </h1>
          <p className={styles.description}>
            Revise os dados abaixo antes de remover definitivamente este agendamento.
          </p>
        </div>

        <button type="button" className={styles.backButton} onClick={handleCancel}>
          Voltar para consultas
        </button>
      </header>

      <div className={styles.dangerCard}>
        <div className={styles.warningHeader}>
          <div className={styles.warningIcon} aria-hidden="true">!</div>
          <div>
            <h2 className={styles.warningTitle}>Confirmar exclusão</h2>
            <p className={styles.warningText}>
              Esta ação remove a consulta da agenda atual.
            </p>
          </div>
        </div>

        <dl className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>Paciente</dt>
            <dd className={styles.summaryValue}>{appointment.patientName}</dd>
          </div>

          <div className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>Médico</dt>
            <dd className={styles.summaryValue}>{appointment.doctorName}</dd>
          </div>

          <div className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>Data</dt>
            <dd className={styles.summaryValue}>{formattedDate}</dd>
          </div>

          <div className={styles.summaryItem}>
            <dt className={styles.summaryLabel}>Hora</dt>
            <dd className={styles.summaryValue}>{formattedTime}</dd>
          </div>
        </dl>

        <p className={styles.confirmationText}>
          Tem certeza de que deseja excluir esta consulta?
        </p>

        <div className={styles.actions}>
          <button type="button" onClick={handleCancel} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="button" onClick={handleDelete} className={styles.deleteButton}>
            Excluir consulta
          </button>
        </div>
      </div>
    </section>
  );
}
