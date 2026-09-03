// src/app/appointments/create/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./CreateAppointment.module.css";
import { useAppointments } from "../../hooks/useAppointments";
import { usePatient } from "../../hooks/usePatient";
import { useDoctor } from "../../hooks/useDoctor";
import type { AppointmentForm, Option } from "../../types/AppointmentForm";
import { AppointmentStatus } from "../../types/Appointment";

export default function CreateAppointmentPage() {
  const router = useRouter();
  const { addAppointment } = useAppointments();
  const { patients } = usePatient();
  const { doctors } = useDoctor();

  const [formData, setFormData] = useState<AppointmentForm>({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: AppointmentStatus.Scheduled.toString(),
    notes: "",
  });

  const patientOptions: Option[] = patients.map((patient) => ({
    value: patient.id.toString(),
    label: patient.name,
  }));

  const doctorOptions: Option[] = doctors.map((doctor) => ({
    value: doctor.id.toString(),
    label: doctor.name,
  }));

  const statusOptions: Option[] = [
    { value: AppointmentStatus.Scheduled.toString(), label: "Agendada" },
    { value: AppointmentStatus.Confirmed.toString(), label: "Confirmada" },
    { value: AppointmentStatus.Cancelled.toString(), label: "Cancelada" },
    { value: AppointmentStatus.Completed.toString(), label: "Concluída" },
  ];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    addAppointment({
      patientId: Number(formData.patientId),
      doctorId: Number(formData.doctorId),
      appointmentDate: new Date(formData.appointmentDate).toISOString(),
      status: Number(formData.status) as AppointmentStatus,
      notes: formData.notes,
    });

    router.push("/appointments");
  };

  return (
    <section className={styles.workspace} aria-labelledby="create-appointment-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Agenda clínica</p>
          <h1 id="create-appointment-title" className={styles.title}>
            Cadastrar Consulta
          </h1>
          <p className={styles.description}>
            Registre paciente, médico, data, status e observações da nova consulta.
          </p>
        </div>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.push("/appointments")}
        >
          Voltar para consultas
        </button>
      </header>

      <div className={styles.formCard}>
        <div className={styles.formIntro}>
          <h2 className={styles.formTitle}>Dados da consulta</h2>
          <p id="create-required-guidance" className={styles.formGuidance}>
            Campos marcados com * são obrigatórios.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
          aria-describedby="create-required-guidance"
        >
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="patientId" className={styles.formLabel}>
                Paciente <span aria-hidden="true" className={styles.requiredMark}>*</span>
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                aria-describedby="patientId-help"
                className={styles.formSelect}
              >
                <option value="">-- Selecione o paciente --</option>
                {patientOptions.map((patient) => (
                  <option key={patient.value} value={patient.value}>
                    {patient.label}
                  </option>
                ))}
              </select>
              <span id="patientId-help" className={styles.fieldHint}>
                Escolha um paciente cadastrado.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="doctorId" className={styles.formLabel}>
                Médico <span aria-hidden="true" className={styles.requiredMark}>*</span>
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                aria-describedby="doctorId-help"
                className={styles.formSelect}
              >
                <option value="">-- Selecione o médico --</option>
                {doctorOptions.map((doctor) => (
                  <option key={doctor.value} value={doctor.value}>
                    {doctor.label}
                  </option>
                ))}
              </select>
              <span id="doctorId-help" className={styles.fieldHint}>
                Escolha o profissional responsável.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="appointmentDate" className={styles.formLabel}>
                Data da Consulta <span aria-hidden="true" className={styles.requiredMark}>*</span>
              </label>
              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                aria-describedby="appointmentDate-help"
                className={styles.formInput}
              />
              <span id="appointmentDate-help" className={styles.fieldHint}>
                Informe a data e o horário previstos.
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.formLabel}>
                Status <span aria-hidden="true" className={styles.requiredMark}>*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                aria-describedby="status-help"
                className={styles.formSelect}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <span id="status-help" className={styles.fieldHint}>
                Defina o estado atual da consulta.
              </span>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="notes" className={styles.formLabel}>
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                aria-describedby="notes-help"
                className={styles.formTextarea}
              />
              <span id="notes-help" className={styles.fieldHint}>
                Campo opcional para informações administrativas relevantes.
              </span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={`${styles.formButton} ${styles.formCancel}`}
              onClick={() => router.push("/appointments")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.formButton} ${styles.formSubmit}`}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
