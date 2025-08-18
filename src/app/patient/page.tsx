// src/app/patient/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Patient.module.css";

interface Patient {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

const PatientIndex: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock de pacientes
    const fetchPatients = async () => {
      const data: Patient[] = [
        { id: 1, name: "João da Silva", cpf: "111.111.111-11", email: "joao@email.com", phone: "9999-9999" },
        { id: 2, name: "Maria Souza", cpf: "222.222.222-22", email: "maria@email.com", phone: "8888-8888" },
      ];
      setPatients(data);
    };
    fetchPatients();
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
                </Link>
              </td>
            </tr>
          ))}
          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
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
