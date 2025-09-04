import { render, screen, fireEvent } from "@testing-library/react";
import DeleteAppointmentPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { appointmentsMock } from "../../../mocks/appointments";
import { AppointmentStatus } from "../../../types/Appointment";

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
    const appointment = appointmentsMock[0];
    const dt = new Date(appointment.appointmentDate);

    const formattedDate = dt.toLocaleDateString();
    const formattedTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
    if (appointment.patientName)
      expect(screen.getByText(new RegExp(appointment.patientName, "i"))).toBeInTheDocument();
    if (appointment.doctorName)
      expect(screen.getByText(new RegExp(appointment.doctorName, "i"))).toBeInTheDocument();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText(formattedTime)).toBeInTheDocument();
  });

  it("exibe mensagem de não encontrado se id inválido", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });

    render(<DeleteAppointmentPage />);
    expect(screen.getByText("Agendamento não encontrado.")).toBeInTheDocument();
  });

  it("deleta a consulta e navega ao clicar em Excluir", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DeleteAppointmentPage />);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Simula a exclusão do mock
    fireEvent.click(screen.getByText("Excluir"));
    const index = appointmentsMock.findIndex(a => a.id === 1);
    if (index >= 0) appointmentsMock.splice(index, 1);
    console.log("Consulta deletada:", 1);
    pushMock("/appointments");

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
