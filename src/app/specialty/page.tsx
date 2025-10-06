// app/specialty/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SpecialtyList.module.css";
import { useSpecialty } from "../hooks/useSpecialty";

// Ícones
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";

export default function SpecialtyList() {
  const { specialties } = useSpecialty();
  const [filter, setFilter] = useState("");
  const router = useRouter();

  const filteredSpecialties = specialties
    .filter(
      (s) =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.id.toString().includes(filter)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.specialtyIndexContainer}>
      <h1>Especialidades</h1>

      <div className={styles.actionsContainer}>
        <button
          className={styles.createLink}
          onClick={() => router.push("/specialty/create")}
          title="Nova Especialidade"
        >
          Nova Especialidade
        </button>

        <input
          type="text"
          placeholder="Pesquisar por Nome ou ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
          aria-label="Pesquisar especialidades"
        />
      </div>

      {filteredSpecialties.length === 0 ? (
        <p className={styles.noResults}>Nenhuma especialidade encontrada.</p>
      ) : (
        <table className={styles.specialtyTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecialties.map((specialty) => (
              <tr key={specialty.id}>
                <td>{specialty.id}</td>
                <td>{specialty.name}</td>
                <td className={styles.actions}>
                  <button
                    className={`${styles.detailsButton} ${styles.iconBtn}`}
                    onClick={() =>
                      router.push(`/specialty/details/${specialty.id}`)
                    }
                    title="Detalhes"
                  >
                    <FaInfoCircle size={16} />
                  </button>
                  <button
                    className={`${styles.editButton} ${styles.iconBtn}`}
                    onClick={() =>
                      router.push(`/specialty/edit/${specialty.id}`)
                    }
                    title="Editar"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className={`${styles.deleteButton} ${styles.iconBtn}`}
                    onClick={() =>
                      router.push(`/specialty/delete/${specialty.id}`)
                    }
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
