// src/app/appointments/delete/[id]/page.tsx

"use client";

import { useRouter } from "next/navigation";
import styles from "../DeleteAppointment.module.css";
import { Appointment, AppointmentStatus } from "../../../types/Appointment";

interface DeleteAppointmentProps {
  appointment: Appointment;
  onDelete: (id: number) => void;
}

const getStatusLabel = (status: AppointmentStatus): string => {
  switch (status) {
    case AppointmentStatus.Scheduled:
      return "Agendada";
    case AppointmentStatus.Confirmed:
      return "Confirmada";
    case AppointmentStatus.Cancelled:
      return "Cancelada";
    case AppointmentStatus.Completed:
      return "Concluída";
    default:
      return "Desconhecido";
  }
};

export default function DeleteAppointment({
  appointment,
  onDelete,
}: DeleteAppointmentProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete(appointment.id);
    router.push("/appointments");
  };

  return (
    <div className={styles.deleteContainer}>
      <h1>Excluir Consulta</h1>
      <h3>Tem certeza que deseja excluir esta consulta?</h3>

      <dl>
        <dt>Paciente</dt>
        <dd>{appointment.patientName ?? `ID ${appointment.patientId}`}</dd>

        <dt>Médico</dt>
        <dd>{appointment.doctorName ?? `ID ${appointment.doctorId}`}</dd>

        <dt>Data e Hora</dt>
        <dd>{new Date(appointment.appointmentDate).toLocaleString("pt-BR")}</dd>

        <dt>Status</dt>
        <dd>{getStatusLabel(appointment.status)}</dd>
      </dl>

      <form onSubmit={handleSubmit}>
        <button type="submit" className={styles.btnDanger}>
          Excluir
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => router.push("/appointments")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
