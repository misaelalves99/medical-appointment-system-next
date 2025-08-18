// src/app/appointments/create/page.tsx

"use client";

import { useState } from "react";
import styles from "./CreateAppointment.module.css";

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  status: string;
  notes: string;
}

export interface Option {
  value: string;
  label: string;
}

interface CreateAppointmentProps {
  patients: Option[];
  doctors: Option[];
  statusOptions: Option[];
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
}

export default function CreateAppointment({
  patients,
  doctors,
  statusOptions,
  onSubmit,
  onCancel,
}: CreateAppointmentProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.createAppointmentContainer}>
      <h1>Nova Consulta</h1>
      <form onSubmit={handleSubmit}>
        {/* Paciente */}
        <div className="form-group">
          <label htmlFor="patientId">Paciente</label>
          <select
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
          >
            <option value="">-- Selecione o paciente --</option>
            {patients.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Médico */}
        <div className="form-group">
          <label htmlFor="doctorId">Médico</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
          >
            <option value="">-- Selecione o médico --</option>
            {doctors.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div className="form-group">
          <label htmlFor="appointmentDate">Data da Consulta</label>
          <input
            type="datetime-local"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">-- Selecione o status --</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Observações */}
        <div className="form-group">
          <label htmlFor="notes">Observações</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {/* Botões */}
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </form>
    </div>
  );
}
