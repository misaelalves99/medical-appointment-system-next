// src/app/patient/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreatePatientPage from "./page";
import { patientsMock } from "../../mocks/patients";
import { useRouter } from "next/navigation";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CreatePatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // resetar patientsMock antes de cada teste
    patientsMock.length = 2; // mantém só os 2 mocks originais
  });

  it("deve renderizar o formulário de cadastro", () => {
    render(<CreatePatientPage />);

    expect(screen.getByRole("heading", { name: /Cadastrar Paciente/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Nascimento:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sexo:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
  });

  it("deve permitir preencher os campos", () => {
    render(<CreatePatientPage />);

    fireEvent.change(screen.getByLabelText(/Nome:/i), {
      target: { value: "João Teste" },
    });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento:/i), {
      target: { value: "1995-12-25" },
    });
    fireEvent.change(screen.getByLabelText(/Sexo:/i), {
      target: { value: "Masculino" },
    });
    fireEvent.change(screen.getByLabelText(/Telefone:/i), {
      target: { value: "99999-9999" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "joao@teste.com" },
    });

    expect(screen.getByLabelText(/Nome:/i)).toHaveValue("João Teste");
    expect(screen.getByLabelText(/Data de Nascimento:/i)).toHaveValue("1995-12-25");
    expect(screen.getByLabelText(/Sexo:/i)).toHaveValue("Masculino");
    expect(screen.getByLabelText(/Telefone:/i)).toHaveValue("99999-9999");
    expect(screen.getByLabelText(/Email:/i)).toHaveValue("joao@teste.com");
  });

  it("deve adicionar paciente no mock e redirecionar ao enviar formulário", () => {
    render(<CreatePatientPage />);

    fireEvent.change(screen.getByLabelText(/Nome:/i), {
      target: { value: "Novo Paciente" },
    });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento:/i), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Sexo:/i), {
      target: { value: "Outro" },
    });
    fireEvent.change(screen.getByLabelText(/Telefone:/i), {
      target: { value: "88888-8888" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "novo@paciente.com" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Salvar/i }));

    // Verifica se foi adicionado ao mock
    expect(patientsMock.length).toBe(3);
    expect(patientsMock[2].name).toBe("Novo Paciente");

    // Verifica redirecionamento
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
