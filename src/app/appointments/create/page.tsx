// src/app/appointments/create/page.tsx

"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateAppointment.module.css";
import { useAppointments } from "../../hooks/useAppointments";
import { usePatient } from "../../hooks/usePatient";
import { useDoctor } from "../../hooks/useDoctor";
import type { AppointmentForm, Option } from "../../types/AppointmentForm";
import { AppointmentStatus } from "../../types/Appointment";

interface Params {
  params: { id: string };
}

export default function EditAppointmentPage({ params }: Params) {
  const router = useRouter();
  const appointmentId = Number(params.id);

  const { appointments, updateAppointment } = useAppointments();
  const { patients } = usePatient();
  const { doctors } = useDoctor();

  const [formData, setFormData] = useState<AppointmentForm>({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: "",
    notes: "",
  });

  // Map para Option[]
  const patientOptions: Option[] = patients.map((p) => ({
    value: p.id.toString(),
    label: p.name,
  }));

  const doctorOptions: Option[] = doctors.map((d) => ({
    value: d.id.toString(),
    label: d.name,
  }));

  const statusOptions: Option[] = [
    { value: AppointmentStatus.Scheduled.toString(), label: "Agendada" },
    { value: AppointmentStatus.Confirmed.toString(), label: "Confirmada" },
    { value: AppointmentStatus.Cancelled.toString(), label: "Cancelada" },
    { value: AppointmentStatus.Completed.toString(), label: "Concluída" },
  ];

  useEffect(() => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    if (appointment) {
      setFormData({
        patientId: appointment.patientId.toString(),
        doctorId: appointment.doctorId.toString(),
        appointmentDate: appointment.appointmentDate.slice(0, 16),
        status: appointment.status.toString(),
        notes: appointment.notes || "",
      });
    }
  }, [appointmentId, appointments]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: AppointmentForm) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateAppointment({
      id: appointmentId,
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId),
      appointmentDate: new Date(formData.appointmentDate).toISOString(),
      status: Number(formData.status),
      notes: formData.notes,
    });

    router.push("/appointments");
  };

  return (
    <div className={styles.createAppointmentContainer}>
      <h1 className={styles.title}>Editar Consulta</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Paciente */}
        <div className={styles.formGroup}>
          <label htmlFor="patientId" className={styles.formLabel}>Paciente</label>
          <select
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className={styles.formSelect}
          >
            <option value="">-- Selecione o paciente --</option>
            {patientOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Médico */}
        <div className={styles.formGroup}>
          <label htmlFor="doctorId" className={styles.formLabel}>Médico</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className={styles.formSelect}
          >
            <option value="">-- Selecione o médico --</option>
            {doctorOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Data e hora */}
        <div className={styles.formGroup}>
          <label htmlFor="appointmentDate" className={styles.formLabel}>Data da Consulta</label>
          <input
            type="datetime-local"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>

        {/* Status */}
        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.formLabel}>Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className={styles.formSelect}
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
        <div className={styles.formGroup}>
          <label htmlFor="notes" className={styles.formLabel}>Observações</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={`${styles.formButton} ${styles.formSubmit}`}>Salvar</button>
          <button
            type="button"
            className={`${styles.formButton} ${styles.formCancel}`}
            onClick={() => router.push("/appointments")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
