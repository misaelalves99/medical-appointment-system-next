// src/app/appointments/confirm/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import styles from './ConfirmAppointment.module.css';

export interface Appointment {
  id: number;
  patientId: number;
  patient?: { fullName: string };
  doctorId: number;
  doctor?: { fullName: string };
  appointmentDate: string;
}

interface ConfirmAppointmentProps {
  appointment: Appointment;
  onConfirm: (id: number) => void;
}

export default function ConfirmAppointment({ appointment, onConfirm }: ConfirmAppointmentProps) {
  const router = useRouter();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(appointment.id);
  };

  return (
    <div className={styles.confirmContainer}>
      <h1>Confirmar Consulta</h1>
      <p>Deseja confirmar esta consulta?</p>

      <ul>
        <li>
          <strong>Data e Hora:</strong> {new Date(appointment.appointmentDate).toLocaleString('pt-BR')}
        </li>
        <li>
          <strong>Paciente:</strong> {appointment.patient?.fullName ?? `ID ${appointment.patientId}`}
        </li>
        <li>
          <strong>Médico:</strong> {appointment.doctor?.fullName ?? `ID ${appointment.doctorId}`}
        </li>
      </ul>

      <form onSubmit={handleConfirm}>
        <button type="submit" className={styles.btnSuccess}>
          Confirmar
        </button>
      </form>

      <button type="button" className={styles.backLink} onClick={() => router.push('/appointments')}>
        Cancelar
      </button>
    </div>
  );
}
