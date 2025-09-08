// src/app/patient/details/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DetailsPatientPage from "./page";
import { useRouter, useParams } from "next/navigation";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock do hook usePatient
const mockPatients = [
  {
    id: 1,
    name: "Carlos Oliveira",
    cpf: "123.456.789-00",
    dateOfBirth: "1990-05-15",
    gender: "Masculino",
    phone: "3333-3333",
    email: "carlos@email.com",
    address: "Rua A, 123",
  },
  {
    id: 2,
    name: "Maria Lima",
    cpf: "987.654.321-00",
    dateOfBirth: "1985-10-20",
    gender: "Feminino",
    phone: "4444-4444",
    email: "maria@email.com",
    address: "Rua B, 456",
  },
];

jest.mock("../../../hooks/usePatient", () => ({
  usePatient: jest.fn(() => ({
    patients: mockPatients,
  })),
}));

describe("DetailsPatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("exibe mensagem de paciente não encontrado se ID não existir", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" }); // id inexistente
    render(<DetailsPatientPage />);
    expect(screen.getByText(/Paciente não encontrado/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Voltar para a Lista/i })).toBeInTheDocument();
  });

  it("renderiza detalhes completos do paciente existente", () => {
    render(<DetailsPatientPage />);
    const patient = mockPatients.find((p) => p.id === 1)!;

    expect(screen.getByText(/Detalhes do Paciente/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.name, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.cpf, "i"))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(new Date(patient.dateOfBirth).toLocaleDateString("pt-BR")))
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.gender, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.phone, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.email, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.address, "i"))).toBeInTheDocument();

    // Botões de ação
    expect(screen.getByRole("button", { name: /Editar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Voltar para a Lista/i })).toBeInTheDocument();
  });

  it("navega para edição ao clicar em Editar", () => {
    render(<DetailsPatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient/edit/1");
  });

  it("navega para listagem ao clicar em Voltar para a Lista", () => {
    render(<DetailsPatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Voltar para a Lista/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
