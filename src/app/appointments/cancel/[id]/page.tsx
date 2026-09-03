"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "../CancelAppointment.module.css";
import { useAppointments } from "../../../hooks/useAppointments";

export default function CancelAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.id ? Number(params.id) : undefined;
  const { appointments, cancelAppointment } = useAppointments();
  const appointment = appointments.find((item) => item.id === appointmentId);

  const handleCancel = () => {
    if (!appointment) return;
    cancelAppointment(appointment.id);
    router.push("/appointments");
  };

  if (!appointment) {
    return (
      <div className={styles.cancelContainer}>
        <h1>Cancelar Consulta</h1>
        <p>Consulta não encontrada.</p>
        <button type="button" className={styles.backLink} onClick={() => router.push("/appointments")}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.cancelContainer}>
      <h1>Cancelar Consulta</h1>
      <p>Tem certeza de que deseja cancelar esta consulta?</p>
      <ul>
        <li><strong>Data e Hora:</strong>{" "}{new Date(appointment.appointmentDate).toLocaleString("pt-BR")}</li>
        <li><strong>Paciente:</strong>{" "}{appointment.patientName || `ID ${appointment.patientId}`}</li>
        <li><strong>Médico:</strong>{" "}{appointment.doctorName || `ID ${appointment.doctorId}`}</li>
      </ul>
      <button type="button" className={styles.btnDanger} onClick={handleCancel}>
        Confirmar Cancelamento
      </button>
      <button type="button" className={styles.backLink} onClick={() => router.push("/appointments")}>
        Voltar
      </button>
    </div>
  );
}
