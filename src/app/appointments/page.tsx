// app/appointments/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AppointmentList.module.css";
import { useAppointments } from "../hooks/useAppointments";
import { usePatient } from "../hooks/usePatient";
import { useDoctor } from "../hooks/useDoctor";
import { getAppointmentStatusLabel } from "../utils/enumHelpers";

// Ícones
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";

export default function AppointmentList() {
  const { appointments } = useAppointments();
  const { patients } = usePatient();
  const { doctors } = useDoctor();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const appointmentsWithNames = useMemo(() => {
    if (!patients.length || !doctors.length) return [];
    return appointments.map(a => {
      const patient = patients.find(p => p.id === a.patientId);
      const doctor = doctors.find(d => d.id === a.doctorId);
      const dt = new Date(a.appointmentDate);
      return {
        ...a,
        patientName: patient?.name ?? `Paciente #${a.patientId}`,
        doctorName: doctor?.name ?? `Médico #${a.doctorId}`,
        dateStr: dt.toLocaleDateString("pt-BR"),
        timeStr: dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
    });
  }, [appointments, patients, doctors]);

  const filteredAppointments = useMemo(() => {
    const searchLower = search.toLowerCase();
    return appointmentsWithNames.filter(a => {
      const statusStr = getAppointmentStatusLabel(a.status).toLowerCase();
      return (
        a.dateStr.includes(searchLower) ||
        a.timeStr.includes(searchLower) ||
        a.patientName.toLowerCase().includes(searchLower) ||
        statusStr.includes(searchLower) ||
        String(a.id).includes(searchLower)
      );
    });
  }, [appointmentsWithNames, search]);

  if (!patients.length || !doctors.length) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Consultas</h1>

      <div className={styles.actions}>
        <button
          className={styles.createBtn}
          onClick={() => router.push("/appointments/create")}
          title="Nova Consulta"
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

      {appointmentsWithNames.length === 0 ? (
        <p className={styles.noResults}>Nenhuma consulta cadastrada.</p>
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
            {filteredAppointments.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.dateStr}</td>
                <td>{a.timeStr}</td>
                <td>{a.patientName}</td>
                <td>{getAppointmentStatusLabel(a.status)}</td>
                <td className={styles.actionButtons}>
                  <button
                    className={`${styles.detailsBtn} ${styles.iconBtn}`}
                    onClick={() => router.push(`/appointments/details/${a.id}`)}
                    title="Detalhes"
                  >
                    <FaInfoCircle size={16} />
                  </button>
                  <button
                    className={`${styles.editBtn} ${styles.iconBtn}`}
                    onClick={() => router.push(`/appointments/edit/${a.id}`)}
                    title="Editar"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className={`${styles.deleteBtn} ${styles.iconBtn}`}
                    onClick={() => router.push(`/appointments/delete/${a.id}`)}
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
