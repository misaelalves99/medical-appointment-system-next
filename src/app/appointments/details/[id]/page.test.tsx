// src/app/appointments/details/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DetailsAppointmentPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { AppointmentStatus } from "../../../types/Appointment";

const pushMock = jest.fn();

const appointmentFixture = {
  id: 1,
  patientId: 10,
  patientName: "Paciente Teste",
  doctorId: 20,
  doctorName: "Doutor Teste",
  appointmentDate: "2025-08-22T10:00",
  status: AppointmentStatus.Scheduled,
  notes: "Observação de teste",
};

let patientFixture = [
  {
    id: 10,
    name: "Paciente Teste",
  },
];

let doctorFixture = [
  {
    id: 20,
    name: "Doutor Teste",
  },
];

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("../../../hooks/useAppointments", () => ({
  useAppointments: jest.fn(() => ({
    appointments: [appointmentFixture],
  })),
}));

jest.mock("../../../hooks/usePatient", () => ({
  usePatient: jest.fn(() => ({
    patients: patientFixture,
  })),
}));

jest.mock("../../../hooks/useDoctor", () => ({
  useDoctor: jest.fn(() => ({
    doctors: doctorFixture,
  })),
}));

describe("DetailsAppointmentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    patientFixture = [
      {
        id: 10,
        name: "Paciente Teste",
      },
    ];

    doctorFixture = [
      {
        id: 20,
        name: "Doutor Teste",
      },
    ];
  });

  it("renderiza detalhes da consulta corretamente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DetailsAppointmentPage />);

    const formattedDateTime = new Date(
      appointmentFixture.appointmentDate,
    ).toLocaleString("pt-BR");

    expect(screen.getByText("Detalhes da Consulta")).toBeInTheDocument();
    expect(screen.getByText("Paciente")).toBeInTheDocument();
    expect(screen.getByText("Paciente Teste")).toBeInTheDocument();
    expect(screen.getByText("Médico")).toBeInTheDocument();
    expect(screen.getByText("Doutor Teste")).toBeInTheDocument();
    expect(screen.getByText("Data e Hora")).toBeInTheDocument();
    expect(screen.getByText(formattedDateTime)).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getAllByText("Agendada")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Observações" })).toBeInTheDocument();
    expect(
      screen.getByText(appointmentFixture.notes),
    ).toBeInTheDocument();
  });

  it("exibe mensagem de não encontrada se id inválido", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });

    render(<DetailsAppointmentPage />);

    expect(
      screen.getByText("Consulta não encontrada."),
    ).toBeInTheDocument();
  });

  it("navega ao clicar em Editar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DetailsAppointmentPage />);

    fireEvent.click(screen.getByRole("button", { name: "Editar consulta" }));

    expect(pushMock).toHaveBeenCalledWith("/appointments/edit/1");
  });

  it("navega ao clicar em Voltar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<DetailsAppointmentPage />);

    fireEvent.click(screen.getByText("Voltar"));

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("exibe fallback de ID se paciente ou médico não existirem nos providers", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    patientFixture = [];
    doctorFixture = [];

    render(<DetailsAppointmentPage />);

    expect(
      screen.getByText(`ID ${appointmentFixture.patientId}`),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`ID ${appointmentFixture.doctorId}`),
    ).toBeInTheDocument();
  });
});