// src/app/appointments/create/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateAppointment.module.css";
import { patientsMock } from "../../mocks/patients";
import { doctorsMock } from "../../mocks/doctors";
import { appointmentsMock } from "../../mocks/appointments";
import { Appointment as AppointmentType, AppointmentStatus } from "../../types/Appointment";

interface Option {
  value: string;
  label: string;
}

export default function CreateAppointmentPage() {
  const router = useRouter();

  // Preparar options a partir do mock
  const patients: Option[] = patientsMock.map((p) => ({
    value: p.id.toString(),
    label: p.name, // corrigido de fullName para name
  }));

  const doctors: Option[] = doctorsMock.map((d) => ({
    value: d.id.toString(),
    label: d.name, // corrigido de fullName para name
  }));

  const statusOptions: { value: AppointmentStatus; label: string }[] = [
    { value: AppointmentStatus.Scheduled, label: "Agendada" },
    { value: AppointmentStatus.Confirmed, label: "Confirmada" },
    { value: AppointmentStatus.Cancelled, label: "Cancelada" },
    { value: AppointmentStatus.Completed, label: "Concluída" },
  ];

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: AppointmentStatus.Scheduled,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const patientId = parseInt(formData.patientId);
    const doctorId = parseInt(formData.doctorId);

    const patient = patientsMock.find((p) => p.id === patientId);
    const doctor = doctorsMock.find((d) => d.id === doctorId);

    if (!patient || !doctor) return;

    const newAppointment: AppointmentType = {
      id: appointmentsMock.length + 1,
      patientId,
      patientName: patient.name,
      doctorId,
      doctorName: doctor.name,
      appointmentDate: formData.appointmentDate,
      status: formData.status as AppointmentStatus,
      notes: formData.notes,
    };

    appointmentsMock.push(newAppointment);
    console.log("Nova consulta criada:", newAppointment);
    router.push("/appointments");
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
        <button type="button" onClick={() => router.push("/appointments")} className="btn-secondary">
          Cancelar
        </button>
      </form>
    </div>
  );
}
