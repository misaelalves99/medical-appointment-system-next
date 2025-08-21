// src/app/doctor/availability/page.tsx

"use client";

import Link from "next/link";
import styles from "./Availability.module.css";
import { doctorsMock, doctorAvailabilitiesMock, DoctorAvailability } from "../../mocks/doctors";

export default function DoctorAvailabilityPage() {
  const sortedAvailabilities = [...doctorAvailabilitiesMock].sort((a, b) => {
    const dateA = new Date(a.date + "T" + a.startTime).getTime();
    const dateB = new Date(b.date + "T" + b.startTime).getTime();
    return dateA - dateB;
  });

  const getDoctorName = (id: number) => {
    const doctor = doctorsMock.find((d) => d.id === id);
    return doctor ? doctor.name : `ID ${id}`;
  };

  return (
    <div className={styles.availabilityContainer}>
      <h1>Disponibilidade dos Médicos</h1>

      <table>
        <thead>
          <tr>
            <th>Médico</th>
            <th>Data</th>
            <th>Hora Início</th>
            <th>Hora Fim</th>
            <th>Disponível</th>
          </tr>
        </thead>
        <tbody>
          {sortedAvailabilities.map((availability: DoctorAvailability, index: number) => (
            <tr key={index}>
              <td>{getDoctorName(availability.doctorId)}</td>
              <td>{new Date(availability.date).toLocaleDateString("pt-BR")}</td>
              <td>{availability.startTime}</td>
              <td>{availability.endTime}</td>
              <td>{availability.isAvailable ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href="/doctor" className={styles.backLink}>
        Voltar
      </Link>
    </div>
  );
}
