// src/app/patient/history/[id]/page.tsx

"use client";

import Link from "next/link";
import styles from "../History/HistoryPatient.module.css";

interface PatientHistoryItem {
  recordDate: string;
  description: string;
  notes?: string | null;
}

interface PatientHistoryProps {
  history: PatientHistoryItem[];
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("pt-BR");

const HistoryPatient: React.FC<PatientHistoryProps> = ({ history }) => {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );

  return (
    <div className={styles.patientHistoryContainer}>
      <h1>Histórico do Paciente</h1>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item, idx) => (
            <tr key={idx}>
              <td>{formatDate(item.recordDate)}</td>
              <td>{item.description}</td>
              <td>{item.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href="/patient" className={styles.backLink}>
        Voltar
      </Link>
    </div>
  );
};

export default HistoryPatient;
