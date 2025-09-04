// src/app/appointments/cancel/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CancelAppointmentPage from "./page";
import { useRouter } from "next/navigation";
import * as appointmentsModule from "../../mocks/appointments";
import { Appointment, AppointmentStatus } from "../../types/Appointment";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CancelAppointmentPage", () => {
  const pushMock = jest.fn();
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  it("renderiza corretamente os dados da consulta", () => {
    render(<CancelAppointmentPage />);
    
    const appointment = appointmentsModule.appointmentsMock[0];

    expect(screen.getByRole("heading", { name: "Cancelar Consulta" })).toBeInTheDocument();
    expect(screen.getByText("Tem certeza de que deseja cancelar esta consulta?")).toBeInTheDocument();

    // Verifica dados
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
    render(<CancelAppointmentPage />);
    expect(screen.getByText("Confirmar Cancelamento")).toHaveClass("btnDanger");
    expect(screen.getByText("Voltar")).toHaveClass("backLink");
  });

  it("chama handleCancel (console.log + navegação) ao clicar em Confirmar Cancelamento", () => {
    render(<CancelAppointmentPage />);
    
    const confirmButton = screen.getByText("Confirmar Cancelamento");
    fireEvent.click(confirmButton);

    const appointment = appointmentsModule.appointmentsMock[0];
    expect(logSpy).toHaveBeenCalledWith("Consulta cancelada:", appointment.id);
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("navega de volta ao clicar no botão Voltar", () => {
    render(<CancelAppointmentPage />);
    
    const backButton = screen.getByText("Voltar");
    fireEvent.click(backButton);

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

    // Spy no getter do módulo
    jest
      .spyOn(appointmentsModule, "appointmentsMock", "get")
      .mockReturnValue(mockAppointments);

    render(<CancelAppointmentPage />);

    expect(screen.getByText(/Paciente:/).textContent).toContain("ID 42");
    expect(screen.getByText(/Médico:/).textContent).toContain("ID 77");
  });
});
