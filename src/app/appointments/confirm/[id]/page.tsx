"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "../ConfirmAppointment.module.css";
import { useAppointments } from "../../../hooks/useAppointments";

export default function ConfirmAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.id ? Number(params.id) : undefined;
  const { appointments, confirmAppointment } = useAppointments();
  const appointment = appointments.find((item) => item.id === appointmentId);

  const handleConfirm = () => {
    if (!appointment) return;
    confirmAppointment(appointment.id);
    router.push("/appointments");
  };

  if (!appointment) {
    return (
      <div className={styles.confirmContainer}>
        <h1>Confirmar Consulta</h1>
        <p>Consulta não encontrada.</p>
        <button type="button" className={styles.backLink} onClick={() => router.push("/appointments")}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.confirmContainer}>
      <h1>Confirmar Consulta</h1>
      <p>Deseja confirmar esta consulta?</p>
      <ul>
        <li><strong>Data e Hora:</strong>{" "}{new Date(appointment.appointmentDate).toLocaleString("pt-BR")}</li>
        <li><strong>Paciente:</strong>{" "}{appointment.patientName || `ID ${appointment.patientId}`}</li>
        <li><strong>Médico:</strong>{" "}{appointment.doctorName || `ID ${appointment.doctorId}`}</li>
      </ul>
      <button type="button" className={styles.btnSuccess} onClick={handleConfirm}>
        Confirmar
      </button>
      <button type="button" className={styles.backLink} onClick={() => router.push("/appointments")}>
        Voltar
      </button>
    </div>
  );
}
