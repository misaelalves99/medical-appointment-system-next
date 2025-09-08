// src/app/patient/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreatePatientPage from "./page";
import { useRouter } from "next/navigation";
import { usePatient } from "../../hooks/usePatient";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock do hook usePatient
const addPatientMock = jest.fn();
jest.mock("../../hooks/usePatient", () => ({
  usePatient: jest.fn(() => ({
    patients: [],
    addPatient: addPatientMock,
  })),
}));

describe("CreatePatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    addPatientMock.mockClear();
  });

  it("renderiza o formulário de cadastro corretamente", () => {
    render(<CreatePatientPage />);
    expect(screen.getByRole("heading", { name: /Cadastrar Paciente/i })).toBeInTheDocument();
    ["Nome", "CPF", "Data de Nascimento", "Sexo", "Telefone", "Email", "Endereço"].forEach(label => {
      expect(screen.getByLabelText(new RegExp(label, "i"))).toBeInTheDocument();
    });
  });

  it("permite preencher os campos corretamente", () => {
    render(<CreatePatientPage />);
    fireEvent.change(screen.getByLabelText(/Nome:/i), { target: { value: "João Teste" } });
    fireEvent.change(screen.getByLabelText(/CPF:/i), { target: { value: "123.456.789-00" } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento:/i), { target: { value: "1995-12-25" } });
    fireEvent.change(screen.getByLabelText(/Sexo:/i), { target: { value: "Masculino" } });
    fireEvent.change(screen.getByLabelText(/Telefone:/i), { target: { value: "99999-9999" } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "joao@teste.com" } });
    fireEvent.change(screen.getByLabelText(/Endereço:/i), { target: { value: "Rua Teste, 123" } });

    expect(screen.getByLabelText(/Nome:/i)).toHaveValue("João Teste");
    expect(screen.getByLabelText(/CPF:/i)).toHaveValue("123.456.789-00");
    expect(screen.getByLabelText(/Data de Nascimento:/i)).toHaveValue("1995-12-25");
    expect(screen.getByLabelText(/Sexo:/i)).toHaveValue("Masculino");
    expect(screen.getByLabelText(/Telefone:/i)).toHaveValue("99999-9999");
    expect(screen.getByLabelText(/Email:/i)).toHaveValue("joao@teste.com");
    expect(screen.getByLabelText(/Endereço:/i)).toHaveValue("Rua Teste, 123");
  });

  it("adiciona paciente e redireciona corretamente", () => {
    render(<CreatePatientPage />);

    const patientData = {
      name: "Novo Paciente",
      cpf: "111.222.333-44",
      dateOfBirth: "2000-01-01",
      gender: "Outro",
      phone: "88888-8888",
      email: "novo@paciente.com",
      address: "Rua Novo, 456",
    };

    Object.entries(patientData).forEach(([key, value]) => {
      const input = screen.getByLabelText(new RegExp(key, "i"));
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.submit(screen.getByRole("button", { name: /Salvar/i }));

    // Verifica chamada do hook
    expect(addPatientMock).toHaveBeenCalledWith(expect.objectContaining({
      ...patientData,
      id: 1,
    }));

    // Verifica redirecionamento
    expect(pushMock).toHaveBeenCalledWith("/patient");

    // Formatos válidos
    expect(() => new Date(patientData.dateOfBirth).toISOString()).not.toThrow();
    expect(patientData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(["Masculino", "Feminino", "Outro"]).toContain(patientData.gender);
  });

  it("cancela e redireciona corretamente", () => {
    render(<CreatePatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("atribui id 1 corretamente quando não há pacientes", () => {
    // Mock com array vazio
    (usePatient as jest.Mock).mockReturnValue({ patients: [], addPatient: addPatientMock });

    render(<CreatePatientPage />);
    fireEvent.change(screen.getByLabelText(/Nome:/i), { target: { value: "Paciente Único" } });
    fireEvent.change(screen.getByLabelText(/CPF:/i), { target: { value: "000.000.000-00" } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento:/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/Sexo:/i), { target: { value: "Masculino" } });
    fireEvent.change(screen.getByLabelText(/Endereço:/i), { target: { value: "Rua Única, 1" } });

    fireEvent.submit(screen.getByRole("button", { name: /Salvar/i }));
    expect(addPatientMock).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });
});
