// src/app/appointments/confirm/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmAppointmentPage from "./page";
import { useRouter } from "next/navigation";
import * as appointmentsModule from "../../mocks/appointments";
import { Appointment, AppointmentStatus } from "../../types/Appointment";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ConfirmAppointmentPage", () => {
  const pushMock = jest.fn();
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renderiza corretamente os dados da consulta", () => {
    render(<ConfirmAppointmentPage />);
    const appointment = appointmentsModule.appointmentsMock[0];

    expect(screen.getByRole("heading", { name: "Confirmar Consulta" })).toBeInTheDocument();
    expect(screen.getByText("Deseja confirmar esta consulta?")).toBeInTheDocument();

    expect(screen.getByText(/Data e Hora:/).textContent).toContain(
      new Date(appointment.appointmentDate).toLocaleString("pt-BR")
    );
    expect(screen.getByText(/Paciente:/).textContent).toContain(
      appointment.patientName || `ID ${appointment.patientId}`
    );
    expect(screen.getByText(/Médico:/).textContent).toContain(
      appointment.doctorName || `ID ${appointment.doctorId}`
    );
  });

  it("botões possuem classes corretas", () => {
    render(<ConfirmAppointmentPage />);
    expect(screen.getByText("Confirmar")).toHaveClass("btnSuccess");
    expect(screen.getByText("Cancelar")).toHaveClass("backLink");
  });

  it("confirma a consulta e navega ao clicar no botão Confirmar", () => {
    render(<ConfirmAppointmentPage />);
    const appointment = appointmentsModule.appointmentsMock[0];

    fireEvent.click(screen.getByText("Confirmar"));

    expect(consoleSpy).toHaveBeenCalledWith("Consulta confirmada:", appointment.id);
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("navega de volta ao clicar em Cancelar", () => {
    render(<ConfirmAppointmentPage />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("mostra fallback de ID quando paciente ou médico não tem nome", () => {
    const mockAppointments: Appointment[] = [
      {
        id: 999,
        appointmentDate: new Date().toISOString(),
        patientId: 42,
        doctorId: 77,
        patientName: "",
        doctorName: "",
        status: AppointmentStatus.Scheduled,
        notes: "",
      },
    ];

    // ✅ spyOn usando import do módulo, sem require nem any
    jest
      .spyOn(appointmentsModule, "appointmentsMock", "get")
      .mockReturnValue(mockAppointments);

    render(<ConfirmAppointmentPage />);

    expect(screen.getByText(/Paciente:/).textContent).toContain("ID 42");
    expect(screen.getByText(/Médico:/).textContent).toContain("ID 77");
  });
});
