// app/specialty/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SpecialtyList.module.css";
import { useSpecialty } from "../hooks/useSpecialty";

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

      <button
        className={styles.createLink}
        onClick={() => router.push("/specialty/create")}
      >
        Cadastrar Nova Especialidade
      </button>

      <div>
        <input
          type="text"
          placeholder="Pesquisar por Nome ou ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
          aria-label="Pesquisar especialidades"
        />

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
                    className={styles.detailsButton}
                    onClick={() => router.push(`/specialty/details/${specialty.id}`)}
                  >
                    Detalhes
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => router.push(`/specialty/edit/${specialty.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => router.push(`/specialty/delete/${specialty.id}`)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {filteredSpecialties.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.noResults}>
                  Nenhuma especialidade encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
