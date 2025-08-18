// src/app/doctor/availability/page.tsx

"use client";

import Link from "next/link";
import styles from "./Availability.module.css";

export interface DoctorAvailability {
  doctorId: number;
  date: string; // formato ISO (ex: "2025-08-08")
  startTime: string; // ex: "08:00"
  endTime: string;   // ex: "12:00"
  isAvailable: boolean;
}

interface AvailabilityProps {
  availabilities: DoctorAvailability[];
}

const Availability: React.FC<AvailabilityProps> = ({ availabilities }) => {
  const sortedAvailabilities = [...availabilities].sort((a, b) => {
    const dateA = new Date(a.date + "T" + a.startTime).getTime();
    const dateB = new Date(b.date + "T" + b.startTime).getTime();
    return dateA - dateB;
  });

  return (
    <div className={styles.availabilityContainer}>
      <h1>Disponibilidade dos Médicos</h1>

      <table>
        <thead>
          <tr>
            <th>ID do Médico</th>
            <th>Data</th>
            <th>Hora Início</th>
            <th>Hora Fim</th>
            <th>Disponível</th>
          </tr>
        </thead>
        <tbody>
          {sortedAvailabilities.map((availability, index) => (
            <tr key={index}>
              <td>{availability.doctorId}</td>
              <td>{new Date(availability.date).toLocaleDateString("pt-BR")}</td>
              <td>{availability.startTime}</td>
              <td>{availability.endTime}</td>
              <td>{availability.isAvailable ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href="/doctor" className={styles.backLink}>Voltar</Link>
    </div>
  );
};

export default Availability;
