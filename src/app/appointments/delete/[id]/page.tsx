// src/app/appointments/delete/[id]/page.tsx

// src/app/appointments/delete/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../DeleteAppointment.module.css";
import { useAppointments } from "../../../hooks/useAppointments";
import { Appointment } from "../../../types/Appointment";

export default function DeleteAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  const { appointments, deleteAppointment } = useAppointments();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (idParam) {
      const found = appointments.find(a => a.id === idParam) || null;
      setAppointment(found);
    }
  }, [idParam, appointments]);

  const handleDelete = () => {
    if (appointment) {
      deleteAppointment(appointment.id);
      router.push("/appointments");
    }
  };

  const handleCancel = () => router.push("/appointments");

  if (!appointment) return <p>Agendamento não encontrado.</p>;

  const dt = new Date(appointment.appointmentDate);
  const formattedDate = dt.toLocaleDateString();
  const formattedTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.container}>
      <h1>Confirmar Exclusão</h1>
      <p>
        Tem certeza de que deseja excluir o agendamento de{" "}
        <strong>{appointment.patientName}</strong> com{" "}
        <strong>{appointment.doctorName}</strong> no dia{" "}
        <strong>{formattedDate}</strong> às <strong>{formattedTime}</strong>?
      </p>

      <div className={styles.actions}>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Excluir
        </button>
        <button onClick={handleCancel} className={styles.cancelButton}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
