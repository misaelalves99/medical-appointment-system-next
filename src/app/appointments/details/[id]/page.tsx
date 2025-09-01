// src/app/appointments/details/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DetailsAppointment.module.css";
import { useAppointments } from "../../../hooks/useAppointments";
import { Appointment, AppointmentStatus } from "../../../types/Appointment";

export default function DetailsAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { appointments } = useAppointments();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Busca a consulta ao carregar ou quando a lista mudar
  useEffect(() => {
    if (idParam) {
      const found = appointments.find((a) => a.id === idParam) || null;
      setAppointment(found);
    }
  }, [idParam, appointments]);

  // Funções de navegação
  const handleEdit = () => appointment && router.push(`/appointments/edit/${appointment.id}`);
  const handleBack = () => router.push("/appointments");

  // Label amigável para o status
  const getStatusLabel = (status: number) => {
    switch (status) {
      case AppointmentStatus.Scheduled: return "Agendada";
      case AppointmentStatus.Confirmed: return "Confirmada";
      case AppointmentStatus.Cancelled: return "Cancelada";
      case AppointmentStatus.Completed: return "Concluída";
      default: return "Desconhecido";
    }
  };

  // Se não encontrar a consulta
  if (!appointment) {
    return (
      <div className={styles.appointmentDetailsContainer}>
        <h1>Detalhes da Consulta</h1>
        <p>Consulta não encontrada.</p>
        <button onClick={handleBack} className={styles.back}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.appointmentDetailsContainer}>
      <h1>Detalhes da Consulta</h1>

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
        <span className={styles.infoValue}>
          {new Date(appointment.appointmentDate).toLocaleString("pt-BR")}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Status</span>
        <span className={styles.infoValue}>
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      {appointment.notes && (
        <div className={styles.notes}>
          <strong>Observações:</strong> {appointment.notes}
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.edit} onClick={handleEdit}>
          Editar
        </button>
        <button className={styles.back} onClick={handleBack}>
          Voltar
        </button>
      </div>
    </div>
  );
}
