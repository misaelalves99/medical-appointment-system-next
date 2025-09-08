// app/appointments/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentList from "./page";
import { useRouter } from "next/navigation";
import { appointmentsMock } from "../mocks/appointments";
import { AppointmentStatus } from "../types/Appointment";
import * as usePatientHook from "../hooks/usePatient";
import * as useDoctorHook from "../hooks/useDoctor";
import type { PatientContextType } from "../contexts/PatientContext";
import type { DoctorContextType } from "../contexts/DoctorContext";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock de consultas
jest.mock("../hooks/useAppointments", () => ({
  useAppointments: jest.fn(() => ({ appointments: appointmentsMock })),
}));

// Dados de exemplo
const mockPatients = [
  {
    id: 10,
    name: "Paciente 1",
    cpf: "111.111.111-11",
    dateOfBirth: "1990-01-01",
    email: "paciente1@example.com",
    phone: "1111-1111",
    address: "Rua A, 100",
  },
  {
    id: 11,
    name: "Paciente 2",
    cpf: "222.222.222-22",
    dateOfBirth: "1992-02-02",
    email: "paciente2@example.com",
    phone: "2222-2222",
    address: "Rua B, 200",
  },
];

const mockDoctors = [
  {
    id: 20,
    name: "Doutor 1",
    cpf: "333.333.333-33",
    dateOfBirth: "1980-03-03",
    email: "doutor1@example.com",
    phone: "3333-3333",
    address: "Rua C, 300",
    specialty: "Cardiologia",
    crm: "CRM123",
    isActive: true,
  },
  {
    id: 21,
    name: "Doutor 2",
    cpf: "444.444.444-44",
    dateOfBirth: "1982-04-04",
    email: "doutor2@example.com",
    phone: "4444-4444",
    address: "Rua D, 400",
    specialty: "Pediatria",
    crm: "CRM456",
    isActive: true,
  },
];

// Contextos completos com métodos mockados
const mockPatientContext: PatientContextType = {
  patients: mockPatients,
  addPatient: jest.fn(),
  updatePatient: jest.fn(),
  deletePatient: jest.fn(),
  updatePatientProfilePicture: jest.fn(),
};

const mockDoctorContext: DoctorContextType = {
  doctors: mockDoctors,
  addDoctor: jest.fn(),
  updateDoctor: jest.fn(),
  removeDoctor: jest.fn(),
};

describe("AppointmentList", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Reset do mock de consultas
    appointmentsMock.length = 0;
    appointmentsMock.push(
      {
        id: 1,
        patientId: 10,
        doctorId: 20,
        appointmentDate: "2025-08-22T10:00",
        status: AppointmentStatus.Scheduled,
        notes: "",
      },
      {
        id: 2,
        patientId: 11,
        doctorId: 21,
        appointmentDate: "2025-08-23T14:00",
        status: AppointmentStatus.Confirmed,
        notes: "",
      }
    );

    // Aplica mocks completos antes de cada teste
    jest.spyOn(usePatientHook, "usePatient").mockReturnValue(mockPatientContext);
    jest.spyOn(useDoctorHook, "useDoctor").mockReturnValue(mockDoctorContext);
  });

  it("renderiza a lista de consultas com nomes de paciente e médico", () => {
    render(<AppointmentList />);
    expect(screen.getByText("Lista de Consultas")).toBeInTheDocument();
    expect(screen.getByText("Paciente 1")).toBeInTheDocument();
    expect(screen.getByText("Doutor 1")).toBeInTheDocument();
    expect(screen.getByText("Paciente 2")).toBeInTheDocument();
    expect(screen.getByText("Doutor 2")).toBeInTheDocument();
  });

  it("exibe 'Carregando...' se pacientes ou médicos não estiverem disponíveis", () => {
    // Simula paciente e médico vazio
    jest.spyOn(usePatientHook, "usePatient").mockReturnValue({
      ...mockPatientContext,
      patients: [],
    });

    jest.spyOn(useDoctorHook, "useDoctor").mockReturnValue({
      ...mockDoctorContext,
      doctors: [],
    });

    render(<AppointmentList />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("exibe mensagem quando não houver consultas", () => {
    appointmentsMock.length = 0;
    render(<AppointmentList />);
    expect(screen.getByText("Nenhuma consulta cadastrada.")).toBeInTheDocument();
  });

  it("filtra a tabela pelo search input", () => {
    render(<AppointmentList />);
    const searchInput = screen.getByPlaceholderText(
      "Pesquisar por ID, data, hora, paciente ou status..."
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "Paciente 2" } });

    expect(screen.queryByText("Paciente 1")).not.toBeInTheDocument();
    expect(screen.getByText("Paciente 2")).toBeInTheDocument();
  });

  it("navega ao clicar em Nova Consulta", () => {
    render(<AppointmentList />);
    fireEvent.click(screen.getByText("Nova Consulta"));
    expect(pushMock).toHaveBeenCalledWith("/appointments/create");
  });

  it("navega ao clicar em Detalhes, Editar e Excluir", () => {
    render(<AppointmentList />);

    fireEvent.click(screen.getAllByText("Detalhes")[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments/details/1");

    fireEvent.click(screen.getAllByText("Editar")[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments/edit/1");

    fireEvent.click(screen.getAllByText("Excluir")[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments/delete/1");
  });
});
