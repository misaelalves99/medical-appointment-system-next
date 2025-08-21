// src/app/appointments/details/[id]/page.tsx

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../DetailsAppointment.module.css";
import { appointmentsMock } from "../../../mocks/appointments";
import { Appointment as AppointmentType } from "../../../types/Appointment";

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.id ? Number(params.id) : undefined;

  const [appointment, setAppointment] = useState<AppointmentType | null>(null);

  useEffect(() => {
    if (appointmentId) {
      const found = appointmentsMock.find((a) => a.id === appointmentId) || null;
      setAppointment(found);
    }
  }, [appointmentId]);

  if (!appointment) return <p>Consulta não encontrada ou carregando...</p>;

  const dt = new Date(appointment.appointmentDate);

  return (
    <div className={styles.appointmentDetailsContainer}>
      <h1 className={styles.title}>Detalhes da Consulta</h1>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Paciente</span>
        <span className={styles.infoValue}>
          {appointment.patientName ?? `ID ${appointment.patientId}`}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Médico</span>
        <span className={styles.infoValue}>
          {appointment.doctorName ?? `ID ${appointment.doctorId}`}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Data e Hora</span>
        <span className={styles.infoValue}>{dt.toLocaleString("pt-BR")}</span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Status</span>
        <span className={styles.infoValue}>{appointment.status}</span>
      </div>

      {appointment.notes && (
        <div className={styles.notes}>
          <strong>Observações:</strong> {appointment.notes}
        </div>
      )}

      <div className={styles.actions}>
        <button
          onClick={() => router.push(`/appointments/edit/${appointment.id}`)}
          className={styles.editBtn}
        >
          Editar
        </button>
        <button
          onClick={() => router.push("/appointments")}
          className={styles.backBtn}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
