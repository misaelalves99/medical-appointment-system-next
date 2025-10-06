// app/home/page.tsx

import Link from "next/link";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      <h1>Bem-vindo ao Sistema de Agendamento Médico</h1>
      <p>Escolha uma das opções abaixo:</p>

      <div className={styles.homeButtons}>
        <Link href="/patient" className={styles.patientBtn}>
          Gerenciar Pacientes
        </Link>
        <Link href="/doctor" className={styles.doctorBtn}>
          Gerenciar Médicos
        </Link>
        <Link href="/specialty" className={styles.specialtyBtn}>
          Gerenciar Especialidades
        </Link>
        <Link href="/appointment" className={styles.appointmentBtn}>
          Gerenciar Consultas
        </Link>
      </div>
    </div>
  );
}
