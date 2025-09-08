// src/hooks/useAppointments.test.tsx

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AppointmentsProvider } from "../contexts/AppointmentsProvider";
import { useAppointments } from "./useAppointments";
import { AppointmentStatus } from "../types/Appointment";

describe("useAppointments hook com provider real", () => {
  // Wrapper JSX correto para renderHook
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppointmentsProvider>{children}</AppointmentsProvider>
  );

  it("deve retornar o contexto real e métodos definidos", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });

    expect(result.current.appointments).toBeDefined();
    expect(Array.isArray(result.current.appointments)).toBe(true);
    expect(typeof result.current.addAppointment).toBe("function");
    expect(typeof result.current.updateAppointment).toBe("function");
    expect(typeof result.current.deleteAppointment).toBe("function");
    expect(typeof result.current.confirmAppointment).toBe("function");
    expect(typeof result.current.cancelAppointment).toBe("function");
  });

  it("deve adicionar uma nova appointment", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    const initialCount = result.current.appointments.length;

    act(() => {
      result.current.addAppointment({
        patientId: 1,
        doctorId: 1,
        appointmentDate: "2025-01-01",
        status: AppointmentStatus.Scheduled,
      });
    });

    expect(result.current.appointments.length).toBe(initialCount + 1);
    const newAppointment = result.current.appointments[result.current.appointments.length - 1];
    expect(newAppointment.patientId).toBe(1);
    expect(newAppointment.doctorId).toBe(1);
    expect(newAppointment.status).toBe(AppointmentStatus.Scheduled);
  });

  it("deve atualizar uma appointment existente", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    const appointment = result.current.appointments[0];

    act(() => {
      result.current.updateAppointment({ ...appointment, status: AppointmentStatus.Completed });
    });

    const updated = result.current.appointments.find(a => a.id === appointment.id);
    expect(updated!.status).toBe(AppointmentStatus.Completed);
  });

  it("deve deletar uma appointment", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    const appointment = result.current.appointments[0];
    const initialCount = result.current.appointments.length;

    act(() => {
      result.current.deleteAppointment(appointment.id!);
    });

    expect(result.current.appointments.length).toBe(initialCount - 1);
    const deleted = result.current.appointments.find(a => a.id === appointment.id);
    expect(deleted).toBeUndefined();
  });

  it("deve confirmar uma appointment", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    const appointment = result.current.appointments[0];

    act(() => {
      result.current.confirmAppointment(appointment.id!);
    });

    const updated = result.current.appointments.find(a => a.id === appointment.id);
    expect(updated!.status).toBe(AppointmentStatus.Confirmed);
  });

  it("deve cancelar uma appointment", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    const appointment = result.current.appointments[0];

    act(() => {
      result.current.cancelAppointment(appointment.id!);
    });

    const updated = result.current.appointments.find(a => a.id === appointment.id);
    expect(updated!.status).toBe(AppointmentStatus.Cancelled);
  });
});
