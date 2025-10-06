"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePatient } from "../hooks/usePatient";
import type { Patient } from "../types/Patient";
import styles from "./Patient.module.css";

// Ícones
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";

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
        <button
          className={styles.createLink}
          onClick={() => router.push("/patient/create")}
        >
          Novo Paciente
        </button>

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
                    className={`${styles.detailsLink} ${styles.iconBtn}`}
                    onClick={() => router.push(`/patient/details/${patient.id}`)}
                    title="Detalhes"
                  >
                    <FaInfoCircle size={16} />
                  </button>
                  <button
                    className={`${styles.editLink} ${styles.iconBtn}`}
                    onClick={() => router.push(`/patient/edit/${patient.id}`)}
                    title="Editar"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className={`${styles.deleteLink} ${styles.iconBtn}`}
                    onClick={() => router.push(`/patient/delete/${patient.id}`)}
                    title="Excluir"
                  >
                    <FaTrash size={16} />
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
