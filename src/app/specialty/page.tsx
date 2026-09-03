"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./SpecialtyList.module.css";
import { useSpecialty } from "../hooks/useSpecialty";
import { FaInfoCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function SpecialtyList() {
  const { specialties } = useSpecialty();
  const [filter, setFilter] = useState("");

  const normalizedFilter = filter.trim().toLowerCase();
  const filteredSpecialties = specialties
    .filter(
      (specialty) =>
        specialty.name.toLowerCase().includes(normalizedFilter) ||
        specialty.id.toString().includes(normalizedFilter)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const hasSpecialties = specialties.length > 0;
  const hasResults = filteredSpecialties.length > 0;

  return (
    <section className={styles.workspace} aria-labelledby="specialty-title">
      <header className={styles.workspaceHeader}>
        <div>
          <p className={styles.eyebrow}>Catálogo clínico</p>
          <h1 id="specialty-title">Gerenciamento de especialidades</h1>
          <p className={styles.description}>
            Organize as especialidades disponíveis para apoiar o cadastro e a agenda clínica.
          </p>
        </div>

        <Link className={styles.primaryAction} href="/specialty/create">
          <FaPlus aria-hidden="true" />
          Nova especialidade
        </Link>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchGroup}>
          <label htmlFor="specialty-search">Pesquisar especialidades</label>
          <input
            id="specialty-search"
            type="search"
            placeholder="Nome ou ID da especialidade"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>

        <p className={styles.resultCount} aria-live="polite">
          {filteredSpecialties.length} {filteredSpecialties.length === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      {!hasSpecialties ? (
        <div className={styles.emptyState}>
          <h2>Nenhuma especialidade cadastrada</h2>
          <p>Cadastre a primeira especialidade para iniciar o catálogo clínico.</p>
          <Link className={styles.secondaryAction} href="/specialty/create">
            Cadastrar especialidade
          </Link>
        </div>
      ) : !hasResults ? (
        <div className={styles.emptyState}>
          <h2>Nenhum resultado encontrado</h2>
          <p>Nenhuma especialidade corresponde à pesquisa atual.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.specialtyTable}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col" className={styles.actionsHeading}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecialties.map((specialty) => (
                <tr key={specialty.id}>
                  <td>{specialty.id}</td>
                  <td>
                    <span className={styles.specialtyName}>{specialty.name}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        className={styles.iconAction}
                        href={`/specialty/details/${specialty.id}`}
                        aria-label={`Detalhes da especialidade ${specialty.name}`}
                        title="Detalhes"
                      >
                        <FaInfoCircle aria-hidden="true" />
                      </Link>
                      <Link
                        className={styles.iconAction}
                        href={`/specialty/edit/${specialty.id}`}
                        aria-label={`Editar especialidade ${specialty.name}`}
                        title="Editar"
                      >
                        <FaEdit aria-hidden="true" />
                      </Link>
                      <Link
                        className={`${styles.iconAction} ${styles.deleteAction}`}
                        href={`/specialty/delete/${specialty.id}`}
                        aria-label={`Excluir especialidade ${specialty.name}`}
                        title="Excluir"
                      >
                        <FaTrash aria-hidden="true" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
