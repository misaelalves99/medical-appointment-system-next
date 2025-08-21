// src/app/specialty/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SpecialtyList.module.css";
import { specialtiesMock, Specialty } from "../mocks/specialties";

const SpecialtyIndex: React.FC = () => {
  const router = useRouter();
  const [specialties, setSpecialties] = useState<Specialty[]>(specialtiesMock);
  const [filter, setFilter] = useState("");

  const filteredSpecialties = specialties
    .filter(
      (s) =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.id.toString().includes(filter)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleDelete = (id: number) => {
    const confirmed = confirm("Tem certeza que deseja excluir esta especialidade?");
    if (confirmed) {
      const updated = specialties.filter((s) => s.id !== id);
      setSpecialties(updated);
      // Atualiza o mock centralizado
      const idx = specialtiesMock.findIndex((s) => s.id === id);
      if (idx !== -1) specialtiesMock.splice(idx, 1);
    }
  };

  return (
    <div className={styles.specialtyIndexContainer}>
      <h1>Especialidades</h1>

      <button
        className={styles.createLink}
        onClick={() => router.push("/specialty/create")}
      >
        Cadastrar Nova Especialidade
      </button>

      <div style={{ marginTop: "1rem" }}>
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
            {filteredSpecialties.length > 0 ? (
              filteredSpecialties.map((specialty) => (
                <tr key={specialty.id}>
                  <td>{specialty.id}</td>
                  <td>{specialty.name}</td>
                  <td>
                    <button
                      className={styles.detailsLink}
                      onClick={() =>
                        router.push(`/specialty/details/${specialty.id}`)
                      }
                    >
                      Detalhes
                    </button>
                    <button
                      className={styles.detailsLink}
                      style={{ backgroundColor: "#ffc107" }}
                      onClick={() =>
                        router.push(`/specialty/edit/${specialty.id}`)
                      }
                    >
                      Editar
                    </button>
                    <button
                      className={styles.detailsLink}
                      style={{ backgroundColor: "#dc3545" }}
                      onClick={() => handleDelete(specialty.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                  Nenhuma especialidade encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecialtyIndex;
