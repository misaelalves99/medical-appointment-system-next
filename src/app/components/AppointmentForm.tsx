// src/app/appointments/components/AppointmentForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Appointment, AppointmentStatus } from "../types/Appointment";
import styles from "../AppointmentForm.module.css";
import { useRouter, useParams } from "next/navigation";
import { appointmentsMock } from "../mocks/appointments";

interface FormState {
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentDate: string;
  status: AppointmentStatus;
  notes?: string;
}

const toLocalDateTimeInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromLocalDateTimeInputToISO = (val: string) => new Date(val).toISOString();

const AppointmentForm: React.FC<{ mode: "create" | "edit" }> = ({ mode }) => {
  const [state, setState] = useState<FormState>({
    patientId: 0,
    patientName: "",
    doctorId: 0,
    doctorName: "",
    appointmentDate: toLocalDateTimeInput(new Date().toISOString()),
    status: AppointmentStatus.Scheduled,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id ? Number(params.id) : undefined;

  useEffect(() => {
    if (mode === "edit" && idParam) {
      setLoading(true);
      const item = appointmentsMock.find((a) => a.id === idParam);
      if (item) {
        setState({
          patientId: item.patientId,
          patientName: item.patientName ?? "",
          doctorId: item.doctorId,
          doctorName: item.doctorName ?? "",
          appointmentDate: toLocalDateTimeInput(item.appointmentDate),
          status: item.status,
          notes: item.notes ?? "",
        });
      }
      setLoading(false);
    }
  }, [mode, idParam]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!state.patientId || state.patientId <= 0) e.patientId = "Paciente é obrigatório";
    if (!state.doctorId || state.doctorId <= 0) e.doctorId = "Médico é obrigatório";
    if (!state.appointmentDate) e.appointmentDate = "Data e hora são obrigatórias";

    // apenas para exibição no console, evita warning de variável não usada
    if (Object.keys(e).length > 0) console.warn("Erros de validação:", e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload: Omit<Appointment, "id"> = {
      patientId: state.patientId,
      patientName: state.patientName,
      doctorId: state.doctorId,
      doctorName: state.doctorName,
      appointmentDate: fromLocalDateTimeInputToISO(state.appointmentDate),
      status: state.status,
      notes: state.notes,
    };

    if (mode === "create") {
      const newId =
        appointmentsMock.length > 0
          ? Math.max(...appointmentsMock.map((a) => a.id)) + 1
          : 1;
      appointmentsMock.push({ id: newId, ...payload });
    } else if (mode === "edit" && idParam) {
      const idx = appointmentsMock.findIndex((a) => a.id === idParam);
      if (idx !== -1) {
        appointmentsMock[idx] = { id: idParam, ...payload };
      }
    }

    router.push("/appointments");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {mode === "create" ? "Nova Consulta" : "Editar Consulta"}
      </h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Inputs iguais ao original */}
          <div>
            <label>Paciente ID:</label>
            <input
              type="number"
              value={state.patientId}
              onChange={(e) => setState({ ...state, patientId: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Médico ID:</label>
            <input
              type="number"
              value={state.doctorId}
              onChange={(e) => setState({ ...state, doctorId: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Data e Hora:</label>
            <input
              type="datetime-local"
              value={state.appointmentDate}
              onChange={(e) => setState({ ...state, appointmentDate: e.target.value })}
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              value={state.status}
              onChange={(e) =>
                setState({
                  ...state,
                  status: Number(e.target.value) as AppointmentStatus,
                })
              }
            >
              <option value={AppointmentStatus.Scheduled}>Agendada</option>
              <option value={AppointmentStatus.Confirmed}>Confirmada</option>
              <option value={AppointmentStatus.Cancelled}>Cancelada</option>
            </select>
          </div>
          <div>
            <label>Notas:</label>
            <textarea
              value={state.notes}
              onChange={(e) => setState({ ...state, notes: e.target.value })}
            />
          </div>

          <button type="submit">{mode === "create" ? "Criar" : "Salvar"}</button>
        </form>
      )}
    </div>
  );
};

export default AppointmentForm;
