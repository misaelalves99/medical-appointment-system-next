"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaInfoCircle, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { usePatient } from "../hooks/usePatient";
import type { Patient } from "../types/Patient";
import styles from "./Patient.module.css";

export default function PatientIndex() {
  const { patients } = usePatient();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const normalizedSearch = search.trim().toLowerCase();
  const filteredPatients: Patient[] = patients.filter((patient: Patient) =>
    [String(patient.id), patient.name ?? "", patient.cpf ?? "", patient.phone ?? ""].some((field) =>
      field.toLowerCase().includes(normalizedSearch)
    )
  );

  const hasPatients = patients.length > 0;
  const hasResults = filteredPatients.length > 0;
  const resultLabel = `${filteredPatients.length} ${filteredPatients.length === 1 ? "paciente encontrado" : "pacientes encontrados"}`;

  return (
    <section className={styles.workspace} aria-labelledby="patient-workspace-title">
      <div className={styles.workspaceHeader}>
        <div>
          <p className={styles.eyebrow}>Cadastro clínico</p>
          <h1 id="patient-workspace-title">Gerenciamento de pacientes</h1>
          <p className={styles.description}>
            Consulte os cadastros, localize pacientes e acesse as ações disponíveis.
          </p>
        </div>

        <button
          type="button"
          className={styles.primaryAction}
          onClick={() => router.push("/patient/create")}
        >
          <FaPlus aria-hidden="true" />
          Novo paciente
        </button>
      </div>

      <div className={styles.searchPanel}>
        <div className={styles.searchField}>
          <label htmlFor="patient-search">Pesquisar pacientes</label>
          <div className={styles.searchControl}>
            <FaSearch className={styles.searchIcon} aria-hidden="true" />
            <input
              id="patient-search"
              type="search"
              placeholder="ID, nome, CPF ou telefone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <p className={styles.resultCount} aria-live="polite">
          {resultLabel}
        </p>
      </div>

      {!hasPatients ? (
        <div className={styles.emptyState}>
          <h2>Nenhum paciente cadastrado</h2>
          <p>Cadastre um paciente para começar a organizar os registros.</p>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => router.push("/patient/create")}
          >
            Cadastrar paciente
          </button>
        </div>
      ) : !hasResults ? (
        <div className={styles.emptyState}>
          <h2>Nenhum resultado encontrado</h2>
          <p>Tente outro ID, nome, CPF ou telefone.</p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nome</th>
                  <th scope="col">CPF</th>
                  <th scope="col">Telefone</th>
                  <th scope="col" className={styles.actionsHeading}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient: Patient) => (
                  <tr key={patient.id}>
                    <td>
                      <span className={styles.idBadge}>#{patient.id}</span>
                    </td>
                    <td className={styles.patientName}>{patient.name}</td>
                    <td>{patient.cpf || "-"}</td>
                    <td>{patient.phone || "-"}</td>
                    <td>
                      <div className={styles.actionsColumn}>
                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.detailsButton}`}
                          onClick={() => router.push(`/patient/details/${patient.id}`)}
                          aria-label={`Detalhes do paciente ${patient.id}`}
                          title="Detalhes"
                        >
                          <FaInfoCircle aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.editButton}`}
                          onClick={() => router.push(`/patient/edit/${patient.id}`)}
                          aria-label={`Editar paciente ${patient.id}`}
                          title="Editar"
                        >
                          <FaEdit aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.deleteButton}`}
                          onClick={() => router.push(`/patient/delete/${patient.id}`)}
                          aria-label={`Excluir paciente ${patient.id}`}
                          title="Excluir"
                        >
                          <FaTrash aria-hidden="true" />
                        </button>
                      </div>
                    </td>
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
