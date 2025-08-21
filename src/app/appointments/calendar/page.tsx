// src/app/appointments/calendar/page.tsx

"use client";

import { useRouter } from "next/navigation";
import styles from "./CalendarAppointments.module.css";
import { Appointment, AppointmentStatus } from "../../types/Appointment";
import { appointmentsMock } from "../../mocks/appointments"; // importe o mock

export default function CalendarAppointmentsPage() {
  const router = useRouter();
  const appointments: Appointment[] = appointmentsMock;

  // Helper para converter enum para string legível
  const statusToString = (status: AppointmentStatus) => {
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

  const sortedAppointments = [...appointments].sort(
    (a, b) =>
      new Date(a.appointmentDate).getTime() -
      new Date(b.appointmentDate).getTime()
  );

  return (
    <div className={styles.calendarContainer}>
      <h1>Calendário de Consultas</h1>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                {new Date(appointment.appointmentDate).toLocaleDateString(
                  "pt-BR"
                )}
              </td>
              <td>
                {new Date(appointment.appointmentDate).toLocaleTimeString(
                  "pt-BR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </td>
              <td>{appointment.patientName || `ID ${appointment.patientId}`}</td>
              <td>{appointment.doctorName || `ID ${appointment.doctorId}`}</td>
              <td>{statusToString(appointment.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className={styles.backLink}
        onClick={() => router.push("/appointments")}
      >
        Voltar
      </button>
    </div>
  );
}
