"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaClockRotateLeft } from "react-icons/fa6";
import styles from "../HistoryPatient.module.css";
import { patientsHistoryMock, PatientHistoryItem } from "../../../mocks/patients";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("pt-BR");

export default function HistoryPatientPage() {
  const params = useParams();
  const patientId = params?.id ? Number(params.id) : undefined;

  const history: PatientHistoryItem[] = patientId
    ? patientsHistoryMock.filter((item: PatientHistoryItem) => item.patientId === patientId)
    : [];

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );

  return (
    <section className={styles.workspace} aria-labelledby="patient-history-title">
      <Link href="/patient" className={styles.backLink}>
        <FaArrowLeft aria-hidden="true" />
        Voltar
      </Link>

      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Cadastro clínico</p>
          <h1 id="patient-history-title">Histórico do Paciente</h1>
          <p className={styles.description}>
            Consulte os registros disponíveis para o paciente selecionado.
          </p>
        </div>

        <div className={styles.headerIcon} aria-hidden="true">
          <FaClockRotateLeft />
        </div>
      </div>

      {sortedHistory.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <FaClockRotateLeft />
          </div>
          <h2>Sem histórico disponível</h2>
          <p>Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className={styles.historyCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Notas</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistory.map((item, idx) => (
                  <tr key={idx}>
                    <td data-label="Data">{formatDate(item.recordDate)}</td>
                    <td data-label="Descrição">{item.description}</td>
                    <td data-label="Notas">{item.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
