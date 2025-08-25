// src/app/appointments/cancel/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CancelAppointmentPage from "./page";
import { useRouter } from "next/navigation";
import { appointmentsMock } from "../../mocks/appointments";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CancelAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it("renderiza corretamente os dados da consulta", () => {
    render(<CancelAppointmentPage />);
    
    const appointment = appointmentsMock[0];

    expect(screen.getByText("Cancelar Consulta")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza de que deseja cancelar esta consulta?")).toBeInTheDocument();
    
    expect(screen.getByText(/Data e Hora:/)).toHaveTextContent(
      new Date(appointment.appointmentDate).toLocaleString("pt-BR")
    );
    expect(screen.getByText(/Paciente:/)).toHaveTextContent(
      appointment.patientName || `ID ${appointment.patientId}`
    );
    expect(screen.getByText(/Médico:/)).toHaveTextContent(
      appointment.doctorName || `ID ${appointment.doctorId}`
    );
  });

  it("chama handleCancel e navega ao clicar no botão Confirmar Cancelamento", () => {
    render(<CancelAppointmentPage />);
    
    const confirmButton = screen.getByText("Confirmar Cancelamento");
    fireEvent.click(confirmButton);

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("navega de volta ao clicar no botão Voltar", () => {
    render(<CancelAppointmentPage />);
    
    const backButton = screen.getByText("Voltar");
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });
});
