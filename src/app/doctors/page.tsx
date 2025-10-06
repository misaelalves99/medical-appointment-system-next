// src/app/doctors/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DoctorList.module.css";
import { useDoctor } from "../hooks/useDoctor";
import type { Doctor } from "../types/Doctor";

// Ícones
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";

export default function DoctorList() {
  const { doctors } = useDoctor();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredDoctors: Doctor[] = doctors.filter((doctor: Doctor) =>
    [
      doctor.id.toString(),
      doctor.name,
      doctor.crm,
      doctor.specialty,
      doctor.isActive ? "Sim" : "Não",
    ].some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <h1>Lista de Médicos</h1>
      <div className={styles.actionsContainer}>
        <button
          className={styles.createButton}
          onClick={() => router.push("/doctors/create")}
        >
          Novo Médico
        </button>
        <input
          type="text"
          placeholder="Pesquisar por ID, Nome, CRM, Especialidade ou Status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredDoctors.length === 0 ? (
        <p className={styles.noResults}>Nenhum médico encontrado.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CRM</th>
              <th>Especialidade</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doctor: Doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.name}</td>
                <td>{doctor.crm}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.isActive ? "Sim" : "Não"}</td>
                <td className={styles.actionsColumn}>
                  <button
                    className={`${styles.detailsButton} ${styles.iconBtn}`}
                    onClick={() => router.push(`/doctors/details/${doctor.id}`)}
                    title="Detalhes"
                  >
                    <FaInfoCircle size={16} />
                  </button>
                  <button
                    className={`${styles.editButton} ${styles.iconBtn}`}
                    onClick={() => router.push(`/doctors/edit/${doctor.id}`)}
                    title="Editar"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className={`${styles.deleteButton} ${styles.iconBtn}`}
                    onClick={() => router.push(`/doctors/delete/${doctor.id}`)}
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
