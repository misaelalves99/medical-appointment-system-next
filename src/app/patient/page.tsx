// app/patient/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Patient.module.css";
import { usePatient } from "../hooks/usePatient";
import type { Patient } from "../types/Patient";

export default function PatientIndex() {
  const { patients } = usePatient();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredPatients: Patient[] = patients.filter((p: Patient) =>
    [String(p.id), p.name ?? "", p.cpf ?? "", p.phone ?? ""].some((field) =>
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
          placeholder="Pesquisar por ID, Nome, CPF ou Telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <p className={styles.noResults}>Nenhum paciente encontrado.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient: Patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.cpf}</td>
                <td>{patient.phone || "-"}</td>
                <td className={styles.actionsColumn}>
                  <button
                    onClick={() => router.push(`/patient/details/${patient.id}`)}
                    className={styles.detailsLink}
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => router.push(`/patient/edit/${patient.id}`)}
                    className={styles.editLink}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => router.push(`/patient/delete/${patient.id}`)}
                    className={styles.deleteLink}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
