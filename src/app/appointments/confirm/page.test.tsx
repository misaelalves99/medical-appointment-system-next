// src/app/appointments/confirm/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmAppointmentPage from "./page";
import { useRouter } from "next/navigation";
import { appointmentsMock } from "../../mocks/appointments";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ConfirmAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it("renderiza corretamente os dados da consulta", () => {
    render(<ConfirmAppointmentPage />);
    const appointment = appointmentsMock[0];

    expect(screen.getByText("Confirmar Consulta")).toBeInTheDocument();
    expect(screen.getByText("Deseja confirmar esta consulta?")).toBeInTheDocument();

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

  it("confirma a consulta e navega ao clicar no botão Confirmar", () => {
    render(<ConfirmAppointmentPage />);
    const appointment = appointmentsMock[0];

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    fireEvent.click(screen.getByText("Confirmar"));

    expect(consoleSpy).toHaveBeenCalledWith("Consulta confirmada:", appointment.id);
    expect(pushMock).toHaveBeenCalledWith("/appointments");

    consoleSpy.mockRestore();
  });

  it("navega de volta ao clicar em Cancelar", () => {
    render(<ConfirmAppointmentPage />);

    fireEvent.click(screen.getByText("Cancelar"));

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });
});
