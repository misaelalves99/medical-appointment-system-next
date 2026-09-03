// src/app/appointments/details/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DetailsAppointment.module.css";
import { useAppointments } from "../../../hooks/useAppointments";
import { usePatient } from "../../../hooks/usePatient";
import { useDoctor } from "../../../hooks/useDoctor";
import { Appointment, AppointmentStatus } from "../../../types/Appointment";
import { getAppointmentStatusLabel } from "../../../utils/enumHelpers";

export default function DetailsAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { appointments } = useAppointments();
  const { patients } = usePatient();
  const { doctors } = useDoctor();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = appointments.find((item) => item.id === idParam) || null;
      setAppointment(found);
    }
  }, [idParam, appointments]);

  const handleEdit = () => {
    if (appointment) {
      router.push(`/appointments/edit/${appointment.id}`);
    }
  };

  const handleBack = () => router.push("/appointments");

  const getPatientName = () => {
    if (!appointment) return "N/A";
    const patient = patients.find((item) => item.id === appointment.patientId);
    return patient ? patient.name : `ID ${appointment.patientId}`;
  };

  const getDoctorName = () => {
    if (!appointment) return "N/A";
    const doctor = doctors.find((item) => item.id === appointment.doctorId);
    return doctor ? doctor.name : `ID ${appointment.doctorId}`;
  };

  if (!appointment) {
    return (
      <section className={styles.workspace} aria-labelledby="details-not-found-title">
        <div className={styles.emptyCard}>
          <p className={styles.eyebrow}>Agenda clínica</p>
          <h1 id="details-not-found-title" className={styles.title}>
            Detalhes da Consulta
          </h1>
          <p className={styles.emptyText}>Consulta não encontrada.</p>
          <button type="button" onClick={handleBack} className={styles.backButton}>
            Voltar para consultas
          </button>
        </div>
      </section>
    );
  }

  const statusClassName =
    appointment.status === AppointmentStatus.Scheduled
      ? styles.statusScheduled
      : appointment.status === AppointmentStatus.Confirmed
        ? styles.statusConfirmed
        : appointment.status === AppointmentStatus.Cancelled
          ? styles.statusCancelled
          : appointment.status === AppointmentStatus.Completed
            ? styles.statusCompleted
            : styles.statusUnknown;

  return (
    <section className={styles.workspace} aria-labelledby="details-appointment-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Agenda clínica</p>
          <h1 id="details-appointment-title" className={styles.title}>
            Detalhes da Consulta
          </h1>
          <p className={styles.description}>
            Consulte as informações registradas antes de editar ou retornar à agenda.
          </p>
        </div>

        <button type="button" onClick={handleBack} className={styles.backButton}>
          Voltar para consultas
        </button>
      </header>

      <div className={styles.detailsCard}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.cardLabel}>Consulta</p>
            <h2 className={styles.cardTitle}>#{appointment.id}</h2>
          </div>
          <span className={`${styles.statusBadge} ${statusClassName}`}>
            {getAppointmentStatusLabel(appointment.status)}
          </span>
        </div>

        <dl className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <dt className={styles.detailLabel}>Paciente</dt>
            <dd className={styles.detailValue}>{getPatientName()}</dd>
          </div>

          <div className={styles.detailItem}>
            <dt className={styles.detailLabel}>Médico</dt>
            <dd className={styles.detailValue}>{getDoctorName()}</dd>
          </div>

          <div className={styles.detailItem}>
            <dt className={styles.detailLabel}>Data e Hora</dt>
            <dd className={styles.detailValue}>
              {new Date(appointment.appointmentDate).toLocaleString("pt-BR")}
            </dd>
          </div>

          <div className={styles.detailItem}>
            <dt className={styles.detailLabel}>Status</dt>
            <dd className={styles.detailValue}>
              {getAppointmentStatusLabel(appointment.status)}
            </dd>
          </div>
        </dl>

        {appointment.notes && (
          <section className={styles.notes} aria-labelledby="appointment-notes-title">
            <h2 id="appointment-notes-title" className={styles.notesTitle}>
              Observações
            </h2>
            <p className={styles.notesText}>{appointment.notes}</p>
          </section>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.backAction} onClick={handleBack}>
            Voltar
          </button>
          <button type="button" className={styles.editAction} onClick={handleEdit}>
            Editar consulta
          </button>
        </div>
      </div>
    </section>
  );
}
