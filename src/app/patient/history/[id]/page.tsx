"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "../HistoryPatient.module.css";
import { patientsHistoryMock, PatientHistoryItem } from "../../../mocks/patients";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("pt-BR");

export default function HistoryPatientPage() {
  const params = useParams();
  const patientId = params?.id ? Number(params.id) : undefined;

  const history: PatientHistoryItem[] = patientId
    ? patientsHistoryMock.filter((h: PatientHistoryItem) => h.patientId === patientId)
    : [];

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );

  return (
    <div className={styles.patientHistoryContainer}>
      <h1>Histórico do Paciente</h1>

      {sortedHistory.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <table className={styles.table}>
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
      )}

      <Link href="/patient" className={styles.backLink}>
        Voltar
      </Link>
    </div>
  );
}
