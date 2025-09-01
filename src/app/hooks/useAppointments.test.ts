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

    act(() => {
      // ✅ Removido o 'id', pois addAppointment espera Omit<Appointment, "id">
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
});
