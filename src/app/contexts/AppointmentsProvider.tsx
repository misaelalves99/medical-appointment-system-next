// src/contexts/AppointmentsProvider.tsx

"use client";

import React, { useState } from "react";
import { AppointmentsContext } from "./AppointmentsContext";
import type { Appointment } from "../types/Appointment";
import { AppointmentStatus } from "../types/Appointment";
import { appointmentsMock } from "../mocks/appointments";

interface AppointmentsProviderProps {
  children: React.ReactNode;
}

export const AppointmentsProvider: React.FC<AppointmentsProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([...appointmentsMock]);

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    const newAppointment: Appointment = { ...appointment, id: newId };
    setAppointments(prev => [...prev, newAppointment]);
    console.log("Novo agendamento adicionado:", newAppointment);
  };

  const updateAppointment = (updated: Appointment) => {
    setAppointments(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    console.log("Agendamento atualizado:", updated);
  };

  const deleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    console.log("Agendamento excluído com id:", id);
  };

  const confirmAppointment = (id: number) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: AppointmentStatus.Confirmed } : a
      )
    );
    console.log("Agendamento confirmado com id:", id);
  };

  const cancelAppointment = (id: number) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: AppointmentStatus.Cancelled } : a
      )
    );
    console.log("Agendamento cancelado com id:", id);
  };

  return (
    <AppointmentsContext.Provider
      value={{ appointments, addAppointment, updateAppointment, deleteAppointment, confirmAppointment, cancelAppointment }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};
