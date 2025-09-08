// src/app/patient/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EditPatientPage from "./page";
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

const updatePatientMock = jest.fn();

jest.mock("../../../hooks/usePatient", () => ({
  usePatient: jest.fn(() => ({
    patients: mockPatients,
    updatePatient: updatePatientMock,
  })),
}));

describe("EditPatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    updatePatientMock.mockClear();
  });

  it("exibe mensagem de paciente não encontrado se ID não existir", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });
    render(<EditPatientPage />);
    expect(screen.getByText(/Paciente não encontrado/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Voltar/i })).toBeInTheDocument();
  });

  it("renderiza formulário preenchido com dados do paciente existente", () => {
    render(<EditPatientPage />);
    const patient = mockPatients.find((p) => p.id === 1)!;

    expect(screen.getByDisplayValue(patient.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.cpf || "")).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.dateOfBirth)).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.email || "")).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.phone || "")).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.address || "")).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.gender || "")).toBeInTheDocument();
  });

  it("atualiza os valores do formulário ao alterar inputs", () => {
    render(<EditPatientPage />);
    const inputName = screen.getByLabelText(/Nome:/i) as HTMLInputElement;
    const selectGender = screen.getByLabelText(/Sexo:/i) as HTMLSelectElement;

    fireEvent.change(inputName, { target: { value: "Novo Nome" } });
    fireEvent.change(selectGender, { target: { value: "Outro" } });

    expect(inputName.value).toBe("Novo Nome");
    expect(selectGender.value).toBe("Outro");
  });

  it("salva alterações e redireciona ao enviar formulário", () => {
    render(<EditPatientPage />);
    const form = screen.getByText(/Salvar Alterações/i).closest("form")!;
    fireEvent.submit(form);

    // Verifica se updatePatient foi chamado com os dados corretos
    expect(updatePatientMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 })
    );

    // Verifica redirecionamento
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("volta para a listagem ao clicar no botão Voltar", () => {
    render(<EditPatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Voltar/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
