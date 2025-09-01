// app/appointments/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AppointmentList.module.css";
import { useAppointments } from "../hooks/useAppointments";
import { getAppointmentStatusLabel } from "../utils/enumHelpers";

export default function AppointmentList() {
  const { appointments } = useAppointments();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredAppointments = appointments.filter(a => {
    const searchLower = search.toLowerCase();
    const dt = new Date(a.appointmentDate);
    const dateStr = dt.toLocaleDateString().toLowerCase();
    const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    const patientStr = a.patientName ? a.patientName.toLowerCase() : '';
    const statusStr = getAppointmentStatusLabel(a.status).toLowerCase();

    return (
      dateStr.includes(searchLower) ||
      timeStr.includes(searchLower) ||
      patientStr.includes(searchLower) ||
      statusStr.includes(searchLower) ||
      String(a.id).includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Consultas</h1>

      <div className={styles.actions}>
        <button
          className={styles.createBtn}
          onClick={() => router.push("/appointments/create")}
        >
          Nova Consulta
        </button>

        <input
          type="text"
          placeholder="Pesquisar por ID, data, hora, paciente ou status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {appointments.length === 0 ? (
        <p>Nenhuma consulta cadastrada.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(a => {
              const dt = new Date(a.appointmentDate);
              return (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{dt.toLocaleDateString()}</td>
                  <td>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{a.patientName || '—'}</td>
                  <td>{getAppointmentStatusLabel(a.status)}</td>
                  <td className={styles.actionButtons}>
                    <button
                      className={styles.detailsBtn}
                      onClick={() => router.push(`/appointments/details/${a.id}`)}
                    >
                      Detalhes
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => router.push(`/appointments/edit/${a.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => router.push(`/appointments/delete/${a.id}`)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
