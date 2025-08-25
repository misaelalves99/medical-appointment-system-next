// src/app/appointments/cancel/page.tsx

"use client";

import { useRouter } from "next/navigation";
import styles from "./CancelAppointment.module.css";
import { appointmentsMock } from "../../mocks/appointments";
import { Appointment } from "../../types/Appointment";

export default function CancelAppointmentPage() {
  const router = useRouter();

  // Pegamos o primeiro appointment do mock como exemplo
  // Você pode alterar para buscar pelo ID via router params se necessário
  const appointment: Appointment = appointmentsMock[0];

  const handleCancel = (id: number) => {
    // Aqui você pode remover do mock ou chamar API real
    console.log("Consulta cancelada:", id);
    router.push("/appointments");
  };

  return (
    <div className={styles.cancelContainer}>
      <h1>Cancelar Consulta</h1>
      <p>Tem certeza de que deseja cancelar esta consulta?</p>

      <ul>
        <li>
          <strong>Data e Hora:</strong>{" "}
          {new Date(appointment.appointmentDate).toLocaleString("pt-BR")}
        </li>
        <li>
          <strong>Paciente:</strong>{" "}
          {appointment.patientName || `ID ${appointment.patientId}`}
        </li>
        <li>
          <strong>Médico:</strong>{" "}
          {appointment.doctorName || `ID ${appointment.doctorId}`}
        </li>
      </ul>

      <button
        type="button"
        className={styles.btnDanger}
        onClick={() => handleCancel(appointment.id)}
      >
        Confirmar Cancelamento
      </button>

      <button
        type="button"
        className={styles.backLink}
        onClick={() => router.push("/appointments")}
      >
        Voltar
      </button>
    </div>
  );
}
