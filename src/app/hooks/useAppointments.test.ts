// src/hooks/useAppointments.test.tsx

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AppointmentsContext, AppointmentsContextType } from "../contexts/AppointmentsContext";
import { useAppointments } from "./useAppointments";
import { AppointmentStatus } from "../types/Appointment";

describe("useAppointments hook", () => {
  const mockContext: AppointmentsContextType = {
    appointments: [],
    addAppointment: jest.fn(),
    updateAppointment: jest.fn(),
    deleteAppointment: jest.fn(),
    confirmAppointment: jest.fn(),
    cancelAppointment: jest.fn(),
  };

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AppointmentsContext.Provider value={mockContext}>{children}</AppointmentsContext.Provider>
  );

  it("deve retornar o contexto de appointments", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    expect(result.current).toBe(mockContext);
  });

  it("chama addAppointment corretamente", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    act(() => {
      result.current.addAppointment({
        patientId: 1,
        doctorId: 1,
        appointmentDate: "2025-01-01",
        status: AppointmentStatus.Scheduled,
      });
    });
    expect(mockContext.addAppointment).toHaveBeenCalledWith({
      patientId: 1,
      doctorId: 1,
      appointmentDate: "2025-01-01",
      status: AppointmentStatus.Scheduled,
    });
  });

  it("chama updateAppointment corretamente", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    act(() => {
      result.current.updateAppointment({
        id: 1,
        patientId: 1,
        doctorId: 1,
        appointmentDate: "2025-01-02",
        status: AppointmentStatus.Completed,
      });
    });
    expect(mockContext.updateAppointment).toHaveBeenCalledWith({
      id: 1,
      patientId: 1,
      doctorId: 1,
      appointmentDate: "2025-01-02",
      status: AppointmentStatus.Completed,
    });
  });

  it("chama deleteAppointment corretamente", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    act(() => {
      result.current.deleteAppointment(1);
    });
    expect(mockContext.deleteAppointment).toHaveBeenCalledWith(1);
  });

  it("chama confirmAppointment corretamente", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    act(() => {
      result.current.confirmAppointment(1);
    });
    expect(mockContext.confirmAppointment).toHaveBeenCalledWith(1);
  });

  it("chama cancelAppointment corretamente", () => {
    const { result } = renderHook(() => useAppointments(), { wrapper });
    act(() => {
      result.current.cancelAppointment(1);
    });
    expect(mockContext.cancelAppointment).toHaveBeenCalledWith(1);
  });
});
