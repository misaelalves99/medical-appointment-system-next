// src/app/appointments/edit/[id]/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./EditAppointment.module.css";

interface AppointmentForm {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  status: string;
  notes: string;
}

export default function EditAppointment() {
  const [formData, setFormData] = useState<AppointmentForm>({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: "Confirmada",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando consulta:", formData);
  };

  return (
    <div className={styles.editAppointmentContainer}>
      <h1>Editar Consulta</h1>
      <form onSubmit={handleSubmit}>
        <label>Paciente</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
        >
          <option value="">-- Selecione o paciente --</option>
          <option value="1">João da Silva</option>
          <option value="2">Maria Oliveira</option>
        </select>

        <label>Médico</label>
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
        >
          <option value="">-- Selecione o médico --</option>
          <option value="1">Dr. Pedro Souza</option>
          <option value="2">Dra. Ana Costa</option>
        </select>

        <label>Data e Hora</label>
        <input
          type="datetime-local"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Confirmada">Confirmada</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Pendente">Pendente</option>
        </select>

        <label>Observações</label>
        <textarea
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">Salvar</button>
        <Link className={styles.backLink} href="/appointments">
          Cancelar
        </Link>
      </form>
    </div>
  );
}
