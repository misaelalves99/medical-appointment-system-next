// src/utils/enumHelpers.test.tsx

import { getAppointmentStatusLabel } from "./enumHelpers";
import { AppointmentStatus } from "../types/Appointment";

describe("getAppointmentStatusLabel", () => {
  it("deve retornar 'Agendada' para AppointmentStatus.Scheduled", () => {
    expect(getAppointmentStatusLabel(AppointmentStatus.Scheduled)).toBe("Agendada");
  });

  it("deve retornar 'Confirmada' para AppointmentStatus.Confirmed", () => {
    expect(getAppointmentStatusLabel(AppointmentStatus.Confirmed)).toBe("Confirmada");
  });

  it("deve retornar 'Cancelada' para AppointmentStatus.Cancelled", () => {
    expect(getAppointmentStatusLabel(AppointmentStatus.Cancelled)).toBe("Cancelada");
  });

  it("deve retornar 'Concluída' para AppointmentStatus.Completed", () => {
    expect(getAppointmentStatusLabel(AppointmentStatus.Completed)).toBe("Concluída");
  });

  it("deve retornar o valor original caso não seja mapeado", () => {
    // conversão dupla para contornar TS
    const invalidStatus = "OutroStatus" as unknown as AppointmentStatus;
    expect(getAppointmentStatusLabel(invalidStatus)).toBe("OutroStatus");
  });
});
