// src/contexts/AppointmentsProvider.tsx

"use client";

import React, { useState } from "react";
import { AppointmentsContext } from "./AppointmentsContext";
import type { Appointment } from "../types/Appointment";
import { AppointmentStatus } from "../types/Appointment";
import { appointmentsMock } from "../mocks/appointments";
import { patientsMock } from "../mocks/patients";
import { doctorsMock } from "../mocks/doctors";

interface AppointmentsProviderProps {
  children: React.ReactNode;
}

export const AppointmentsProvider: React.FC<AppointmentsProviderProps> = ({ children }) => {
  // Normaliza os mocks iniciais com nomes resolvidos
  const resolveNames = (appointment: Appointment): Appointment => {
    const patient = patientsMock.find(p => p.id === appointment.patientId);
    const doctor = doctorsMock.find(d => d.id === appointment.doctorId);
    return {
      ...appointment,
      patientName: patient?.name ?? `Paciente #${appointment.patientId}`,
      doctorName: doctor?.name ?? `Médico #${appointment.doctorId}`,
    };
  };

  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsMock.map(resolveNames));

  const addAppointment = (appointment: Omit<Appointment, "id" | "patientName" | "doctorName">) => {
    const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    const newAppointment: Appointment = resolveNames({ ...appointment, id: newId });
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (updated: Appointment) => {
    const resolved = resolveNames(updated);
    setAppointments(prev => prev.map(a => (a.id === resolved.id ? resolved : a)));
  };

  const deleteAppointment = (id: number) => setAppointments(prev => prev.filter(a => a.id !== id));

  const confirmAppointment = (id: number) =>
    setAppointments(prev =>
      prev.map(a => (a.id === id ? resolveNames({ ...a, status: AppointmentStatus.Confirmed }) : a))
    );

  const cancelAppointment = (id: number) =>
    setAppointments(prev =>
      prev.map(a => (a.id === id ? resolveNames({ ...a, status: AppointmentStatus.Cancelled }) : a))
    );

  return (
    <AppointmentsContext.Provider
      value={{ appointments, addAppointment, updateAppointment, deleteAppointment, confirmAppointment, cancelAppointment }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};
