// src/app/appointments/details/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DetailsAppointmentPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { appointmentsMock } from "../../../mocks/appointments";
import { AppointmentStatus } from "../../../types/Appointment";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("DetailsAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();

    // Reset do mock
    appointmentsMock.length = 0;
    appointmentsMock.push({
      id: 1,
      patientId: 10,
      patientName: "Paciente Teste",
      doctorId: 20,
      doctorName: "Doutor Teste",
      appointmentDate: "2025-08-22T10:00",
      status: AppointmentStatus.Scheduled,
      notes: "Observação de teste",
    });
  });

  it("renderiza detalhes da consulta corretamente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DetailsAppointmentPage />);

    const appointment = appointmentsMock[0];
    const formattedDateTime = new Date(appointment.appointmentDate).toLocaleString("pt-BR");

    expect(screen.getByText("Detalhes da Consulta")).toBeInTheDocument();
    expect(screen.getByText("Paciente")).toBeInTheDocument();
    expect(screen.getByText(appointment.patientName!)).toBeInTheDocument();
    expect(screen.getByText("Médico")).toBeInTheDocument();
    expect(screen.getByText(appointment.doctorName!)).toBeInTheDocument();
    expect(screen.getByText("Data e Hora")).toBeInTheDocument();
    expect(screen.getByText(formattedDateTime)).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Agendada")).toBeInTheDocument(); // label traduzido
    expect(screen.getByText(/Observações:/)).toBeInTheDocument();
    expect(screen.getByText(appointment.notes!)).toBeInTheDocument();
  });

  it("exibe mensagem de não encontrada se id inválido", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });

    render(<DetailsAppointmentPage />);
    expect(screen.getByText("Consulta não encontrada.")).toBeInTheDocument();
  });

  it("navega ao clicar em Editar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DetailsAppointmentPage />);
    fireEvent.click(screen.getByText("Editar"));
    expect(pushMock).toHaveBeenCalledWith("/appointments/edit/1");
  });

  it("navega ao clicar em Voltar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DetailsAppointmentPage />);
    fireEvent.click(screen.getByText("Voltar"));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("exibe fallback de ID se paciente ou médico não existirem nos mocks", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    // Substitui pacienteName e doctorName para simular ausência nos mocks
    appointmentsMock[0].patientName = "";
    appointmentsMock[0].doctorName = "";

    render(<DetailsAppointmentPage />);

    expect(screen.getByText(`ID ${appointmentsMock[0].patientId}`)).toBeInTheDocument();
    expect(screen.getByText(`ID ${appointmentsMock[0].doctorId}`)).toBeInTheDocument();
  });
});
