// src/app/patient/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Patient.module.css";
import { patientsMock, Patient } from "../mocks/patients"; // import do mock centralizado

const PatientIndex: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simula fetch do mock
    setPatients(patientsMock);
  }, []);

  const filteredPatients = patients.filter((p) =>
    [p.name, p.cpf, p.email, p.phone].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className={styles.patientIndexContainer}>
      <h1>Pacientes</h1>

      <div className={styles.actionsContainer}>
        <Link href="/patient/create" className={styles.createLink}>
          Cadastrar Novo Paciente
        </Link>

        <input
          type="text"
          placeholder="Pesquisar por Nome, CPF, Email ou Telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <table className={styles.patientTable}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.cpf}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>
                <Link
                  href={`/patient/details/${patient.id}`}
                  className={styles.detailsLink}
                >
                  Detalhes
                </Link>{" "}
                <Link
                  href={`/patient/edit/${patient.id}`}
                  className={styles.editLink}
                >
                  Editar
                </Link>{" "}
                <Link
                  href={`/patient/delete/${patient.id}`}
                  className={styles.deleteLink}
                >
                  Excluir
                </Link>{" "}
                <Link
                  href={`/patient/history/${patient.id}`}
                  className={styles.historyLink}
                >
                  Histórico
                </Link>{" "}
                <Link
                  href={`/patient/upload-profile/${patient.id}`}
                  className={styles.uploadLink}
                >
                  Upload Foto
                </Link>
              </td>
            </tr>
          ))}
          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                Nenhum paciente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientIndex;
