// src/app/appointments/details/[id]/page.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentDetailsPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { appointmentsMock } from "../../../mocks/appointments";
import { AppointmentStatus } from "../../../types/Appointment";

// Mock do useRouter e useParams
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("AppointmentDetailsPage", () => {
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
      notes: "Observação de teste",
    });
  });

  it("renderiza detalhes da consulta corretamente", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<AppointmentDetailsPage />);

    expect(await screen.findByText("Detalhes da Consulta")).toBeInTheDocument();

    expect(screen.getByText("Paciente")).toBeInTheDocument();
    expect(screen.getByText("Paciente Teste")).toBeInTheDocument();

    expect(screen.getByText("Médico")).toBeInTheDocument();
    expect(screen.getByText("Doutor Teste")).toBeInTheDocument();

    expect(screen.getByText("Data e Hora")).toBeInTheDocument();
    expect(screen.getByText(new Date("2025-08-22T10:00").toLocaleString("pt-BR"))).toBeInTheDocument();

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText(AppointmentStatus.Scheduled)).toBeInTheDocument();

    expect(screen.getByText(/Observações:/)).toBeInTheDocument();
    expect(screen.getByText("Observação de teste")).toBeInTheDocument();
  });

  it("exibe mensagem de não encontrada se id inválido", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });

    render(<AppointmentDetailsPage />);

    expect(await screen.findByText("Consulta não encontrada ou carregando...")).toBeInTheDocument();
  });

  it("navega ao clicar em Editar", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<AppointmentDetailsPage />);
    const editButton = await screen.findByText("Editar");

    fireEvent.click(editButton);

    expect(pushMock).toHaveBeenCalledWith("/appointments/edit/1");
  });

  it("navega ao clicar em Voltar", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<AppointmentDetailsPage />);
    const backButton = await screen.findByText("Voltar");

    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });
});
