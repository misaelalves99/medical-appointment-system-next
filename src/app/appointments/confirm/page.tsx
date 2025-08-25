// src/app/appointments/confirm/page.tsx

"use client";

import { useRouter } from "next/navigation";
import styles from "./ConfirmAppointment.module.css";
import { appointmentsMock } from "../../mocks/appointments";
import { Appointment } from "../../types/Appointment";

export default function ConfirmAppointmentPage() {
  const router = useRouter();

  // Pegamos o primeiro appointment do mock como exemplo
  // Você pode substituir por ID vindo do router params
  const appointment: Appointment = appointmentsMock[0];

  const handleConfirm = (id: number) => {
    // Aqui você pode atualizar o mock ou chamar API real
    console.log("Consulta confirmada:", id);
    router.push("/appointments");
  };

  return (
    <div className={styles.confirmContainer}>
      <h1>Confirmar Consulta</h1>
      <p>Deseja confirmar esta consulta?</p>

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
        className={styles.btnSuccess}
        onClick={() => handleConfirm(appointment.id)}
      >
        Confirmar
      </button>

      <button
        type="button"
        className={styles.backLink}
        onClick={() => router.push("/appointments")}
      >
        Cancelar
      </button>
    </div>
  );
}
