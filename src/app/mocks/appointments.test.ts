// src/mocks/appointments.test.ts

import { appointmentsMock } from "./appointments";
import { AppointmentStatus } from "../types/Appointment";

describe("appointmentsMock", () => {
  it("deve ser um array com pelo menos um elemento", () => {
    expect(Array.isArray(appointmentsMock)).toBe(true);
    expect(appointmentsMock.length).toBeGreaterThan(0);
  });

  it("cada elemento deve ter propriedades válidas", () => {
    appointmentsMock.forEach((appointment) => {
      expect(typeof appointment.id).toBe("number");
      expect(typeof appointment.patientId).toBe("number");
      expect(typeof appointment.patientName).toBe("string");
      expect(typeof appointment.doctorId).toBe("number");
      expect(typeof appointment.doctorName).toBe("string");
      expect(typeof appointment.appointmentDate).toBe("string");
      expect(Object.values(AppointmentStatus)).toContain(appointment.status);
      expect(typeof appointment.notes).toBe("string");
    });
  });

  it("deve conter dados específicos do mock", () => {
    const appt = appointmentsMock[0];
    expect(appt.patientName).toBe("João da Silva");
    expect(appt.doctorName).toBe("Dra. Maria Oliveira");
    expect(appt.status).toBe(AppointmentStatus.Confirmed);
  });

  it("appointmentDate deve ser uma string ISO válida", () => {
    appointmentsMock.forEach(appt => {
      const date = new Date(appt.appointmentDate);
      expect(!isNaN(date.getTime())).toBe(true); // data válida
      expect(date.toISOString()).toBe(appt.appointmentDate); // formato ISO exato
    });
  });
});
