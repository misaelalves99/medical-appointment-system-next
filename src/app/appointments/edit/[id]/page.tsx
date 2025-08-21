// src/app/appointments/edit/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../EditAppointment.module.css";
import { appointmentsMock } from "../../../mocks/appointments";
import { patientsMock } from "../../../mocks/patients";
import { doctorsMock } from "../../../mocks/doctors";
import { AppointmentStatus } from "../../../types/Appointment";

export default function EditAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.id ? Number(params.id) : undefined;

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: AppointmentStatus.Confirmed,
    notes: "",
  });

  useEffect(() => {
    if (appointmentId) {
      const appointment = appointmentsMock.find(a => a.id === appointmentId);
      if (appointment) {
        setFormData({
          patientId: appointment.patientId.toString(),
          doctorId: appointment.doctorId.toString(),
          appointmentDate: appointment.appointmentDate,
          status: appointment.status,
          notes: appointment.notes ?? "",
        });
      }
    }
  }, [appointmentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) return;

    const index = appointmentsMock.findIndex(a => a.id === appointmentId);
    if (index !== -1) {
      appointmentsMock[index] = {
        ...appointmentsMock[index],
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        status: formData.status as AppointmentStatus,
        notes: formData.notes,
      };
      console.log("Consulta atualizada:", appointmentsMock[index]);
      router.push("/appointments");
    }
  };

  return (
    <div className={styles.editAppointmentContainer}>
      <h1>Editar Consulta</h1>
      <form onSubmit={handleSubmit}>
        <label>Paciente</label>
        <select name="patientId" value={formData.patientId} onChange={handleChange}>
          <option value="">-- Selecione o paciente --</option>
          {patientsMock.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <label>Médico</label>
        <select name="doctorId" value={formData.doctorId} onChange={handleChange}>
          <option value="">-- Selecione o médico --</option>
          {doctorsMock.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <label>Data e Hora</label>
        <input
          type="datetime-local"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
        />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          {Object.values(AppointmentStatus).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label>Observações</label>
        <textarea
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">Salvar</button>
        <button type="button" className={styles.backLink} onClick={() => router.push("/appointments")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
