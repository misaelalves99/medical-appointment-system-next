// src/app/appointments/details/[id]/page.tsx

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./DetailsAppointment.module.css";

export interface Appointment {
  id: number;
  patientId: number;
  patient?: { fullName: string };
  doctorId: number;
  doctor?: { fullName: string };
  appointmentDate: string;
  status: string;
  notes?: string;
}

const appointmentsMock: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    patient: { fullName: "João da Silva" },
    doctorId: 2,
    doctor: { fullName: "Dra. Maria Oliveira" },
    appointmentDate: "2025-08-15T14:30",
    status: "Confirmada",
    notes: "Paciente apresentou melhora significativa.",
  },
  {
    id: 2,
    patientId: 2,
    patient: { fullName: "Ana Souza" },
    doctorId: 1,
    doctor: { fullName: "Dr. João" },
    appointmentDate: "2025-08-16T10:00",
    status: "Pendente",
  },
];

export default function AppointmentDetails() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = appointmentsMock.find((a) => a.id === idParam) || null;
      setAppointment(found);
    }
  }, [idParam]);

  if (!appointment) return <p>Consulta não encontrada ou carregando...</p>;

  const dt = new Date(appointment.appointmentDate);

  return (
    <div className={styles.appointmentDetailsContainer}>
      <h1 className={styles.title}>Detalhes da Consulta</h1>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Paciente</span>
        <span className={styles.infoValue}>
          {appointment.patient?.fullName ?? `ID ${appointment.patientId}`}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Médico</span>
        <span className={styles.infoValue}>
          {appointment.doctor?.fullName ?? `ID ${appointment.doctorId}`}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Data e Hora</span>
        <span className={styles.infoValue}>
          {dt.toLocaleString("pt-BR")}
        </span>
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
        <button onClick={() => router.push("/appointments")} className={styles.backBtn}>
          Voltar
        </button>
      </div>
    </div>
  );
}
