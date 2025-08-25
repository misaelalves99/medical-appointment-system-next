// src/app/appointments/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DeleteAppointmentPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { appointmentsMock } from "../../../mocks/appointments";
import { AppointmentStatus } from "../../../types/Appointment";

// Mock do useRouter e useParams
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("DeleteAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
    appointmentsMock.length = 0;
    appointmentsMock.push({
      id: 1,
      patientId: 10,
      patientName: "Paciente Teste",
      doctorId: 20,
      doctorName: "Doutor Teste",
      appointmentDate: "2025-08-22T10:00",
      status: AppointmentStatus.Scheduled,
      notes: "",
    });
  });

  it("renderiza os detalhes da consulta", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DeleteAppointmentPage />);

    expect(screen.getByText("Excluir Consulta")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza que deseja excluir esta consulta?")).toBeInTheDocument();

    expect(screen.getByText("Paciente")).toBeInTheDocument();
    expect(screen.getByText("Paciente Teste")).toBeInTheDocument();

    expect(screen.getByText("Médico")).toBeInTheDocument();
    expect(screen.getByText("Doutor Teste")).toBeInTheDocument();

    expect(screen.getByText("Data e Hora")).toBeInTheDocument();
    expect(screen.getByText(new Date("2025-08-22T10:00").toLocaleString("pt-BR"))).toBeInTheDocument();

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Agendada")).toBeInTheDocument();
  });

  it("exibe mensagem de não encontrado se id inválido", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });

    render(<DeleteAppointmentPage />);

    expect(screen.getByText("Consulta não encontrada.")).toBeInTheDocument();
  });

  it("deleta a consulta e navega ao clicar em Excluir", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DeleteAppointmentPage />);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    fireEvent.click(screen.getByText("Excluir"));

    expect(appointmentsMock.length).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Consulta deletada:", 1);
    expect(pushMock).toHaveBeenCalledWith("/appointments");

    consoleSpy.mockRestore();
  });

  it("navega ao clicar em Cancelar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DeleteAppointmentPage />);

    fireEvent.click(screen.getByText("Cancelar"));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });
});
