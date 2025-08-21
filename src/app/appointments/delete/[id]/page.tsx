// src/app/appointments/delete/[id]/page.tsx

"use client";

import { useRouter, useParams } from "next/navigation";
import styles from "../DeleteAppointment.module.css";
import { appointmentsMock } from "../../../mocks/appointments";
import { AppointmentStatus } from "../../../types/Appointment";

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

export default function DeleteAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = Number(params.id);

  const appointment = appointmentsMock.find((a) => a.id === appointmentId);

  if (!appointment) {
    return <p>Consulta não encontrada.</p>;
  }

  const handleDelete = () => {
    const index = appointmentsMock.findIndex((a) => a.id === appointmentId);
    if (index > -1) {
      appointmentsMock.splice(index, 1);
      console.log("Consulta deletada:", appointmentId);
    }
    router.push("/appointments");
  };

  return (
    <div className={styles.deleteContainer}>
      <h1 className={styles.title}>Excluir Consulta</h1>
      <h3 className={styles.subtitle}>Tem certeza que deseja excluir esta consulta?</h3>

      <dl className={styles.detailsList}>
        <dt className={styles.detailsTerm}>Paciente</dt>
        <dd className={styles.detailsDesc}>
          {appointment.patientName ?? `ID ${appointment.patientId}`}
        </dd>

        <dt className={styles.detailsTerm}>Médico</dt>
        <dd className={styles.detailsDesc}>
          {appointment.doctorName ?? `ID ${appointment.doctorId}`}
        </dd>

        <dt className={styles.detailsTerm}>Data e Hora</dt>
        <dd className={styles.detailsDesc}>
          {new Date(appointment.appointmentDate).toLocaleString("pt-BR")}
        </dd>

        <dt className={styles.detailsTerm}>Status</dt>
        <dd className={styles.detailsDesc}>{getStatusLabel(appointment.status)}</dd>
      </dl>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
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
