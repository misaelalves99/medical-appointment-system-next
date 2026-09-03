"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./DoctorList.module.css";
import { useDoctor } from "../hooks/useDoctor";
import type { Doctor } from "../types/Doctor";
import { FaInfoCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function DoctorList() {
  const { doctors } = useDoctor();
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredDoctors: Doctor[] = doctors.filter((doctor: Doctor) =>
    [
      doctor.id.toString(),
      doctor.name,
      doctor.crm,
      doctor.specialty,
      doctor.email,
      doctor.phone,
      doctor.isActive ? "Sim" : "Não",
    ].some((value) =>
      String(value).toLowerCase().includes(normalizedSearch)
    )
  );

  const hasDoctors = doctors.length > 0;
  const hasResults = filteredDoctors.length > 0;

  return (
    <section className={styles.workspace} aria-labelledby="doctor-list-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Equipe clínica</p>
          <h1 id="doctor-list-title">Gerenciamento de médicos</h1>
          <p className={styles.description}>
            Consulte e mantenha os profissionais disponíveis para atendimento.
          </p>
        </div>

        <Link href="/doctors/create" className={styles.primaryAction}>
          <FaPlus aria-hidden="true" />
          Novo médico
        </Link>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchGroup}>
          <label htmlFor="doctor-search">Pesquisar médicos</label>
          <input
            id="doctor-search"
            type="search"
            placeholder="ID, nome, CRM, especialidade, email, telefone ou status"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <p className={styles.resultCount} aria-live="polite">
          {filteredDoctors.length} de {doctors.length} médicos
        </p>
      </div>

      {!hasDoctors ? (
        <div className={styles.emptyState}>
          <h2>Nenhum médico cadastrado</h2>
          <p>Cadastre o primeiro profissional para iniciar a equipe clínica.</p>
          <Link href="/doctors/create" className={styles.emptyAction}>
            Cadastrar médico
          </Link>
        </div>
      ) : !hasResults ? (
        <div className={styles.emptyState}>
          <h2>Nenhum resultado encontrado</h2>
          <p>Tente ajustar os termos utilizados na pesquisa.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">CRM</th>
                <th scope="col">Especialidade</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor: Doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>
                    <span className={styles.doctorName}>{doctor.name}</span>
                  </td>
                  <td>{doctor.crm}</td>
                  <td>{doctor.specialty}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        doctor.isActive ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {doctor.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/doctors/details/${doctor.id}`}
                        className={styles.iconAction}
                        aria-label={`Detalhes do médico ${doctor.name}`}
                        title="Detalhes"
                      >
                        <FaInfoCircle aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/doctors/edit/${doctor.id}`}
                        className={styles.iconAction}
                        aria-label={`Editar médico ${doctor.name}`}
                        title="Editar"
                      >
                        <FaEdit aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/doctors/delete/${doctor.id}`}
                        className={`${styles.iconAction} ${styles.deleteAction}`}
                        aria-label={`Excluir médico ${doctor.name}`}
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
