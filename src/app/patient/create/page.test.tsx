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

    // Resetar patientsMock antes de cada teste
    patientsMock.length = 2; // mantém os 2 mocks originais
  });

  it("renderiza o formulário de cadastro corretamente", () => {
    render(<CreatePatientPage />);
    expect(screen.getByRole("heading", { name: /Cadastrar Paciente/i })).toBeInTheDocument();
    ["Nome", "CPF", "Data de Nascimento", "Sexo", "Telefone", "Email", "Endereço"].forEach(label => {
      expect(screen.getByLabelText(new RegExp(label, "i"))).toBeInTheDocument();
    });
  });

  it("permite preencher os campos", () => {
    render(<CreatePatientPage />);
    fireEvent.change(screen.getByLabelText(/Nome:/i), { target: { value: "João Teste" } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento:/i), { target: { value: "1995-12-25" } });
    fireEvent.change(screen.getByLabelText(/Sexo:/i), { target: { value: "Masculino" } });
    fireEvent.change(screen.getByLabelText(/Telefone:/i), { target: { value: "99999-9999" } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "joao@teste.com" } });
    fireEvent.change(screen.getByLabelText(/Endereço:/i), { target: { value: "Rua Teste, 123" } });

    expect(screen.getByLabelText(/Nome:/i)).toHaveValue("João Teste");
    expect(screen.getByLabelText(/Data de Nascimento:/i)).toHaveValue("1995-12-25");
    expect(screen.getByLabelText(/Sexo:/i)).toHaveValue("Masculino");
    expect(screen.getByLabelText(/Telefone:/i)).toHaveValue("99999-9999");
    expect(screen.getByLabelText(/Email:/i)).toHaveValue("joao@teste.com");
    expect(screen.getByLabelText(/Endereço:/i)).toHaveValue("Rua Teste, 123");
  });

  it("adiciona paciente ao enviar formulário e redireciona", () => {
    render(<CreatePatientPage />);
    fireEvent.change(screen.getByLabelText(/Nome:/i), { target: { value: "Novo Paciente" } });
    fireEvent.change(screen.getByLabelText(/CPF:/i), { target: { value: "111.222.333-44" } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento:/i), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByLabelText(/Sexo:/i), { target: { value: "Outro" } });
    fireEvent.change(screen.getByLabelText(/Telefone:/i), { target: { value: "88888-8888" } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: "novo@paciente.com" } });
    fireEvent.change(screen.getByLabelText(/Endereço:/i), { target: { value: "Rua Novo, 456" } });

    fireEvent.submit(screen.getByRole("button", { name: /Salvar/i }));

    // Verifica adição ao mock
    expect(patientsMock.length).toBe(3);
    const added = patientsMock[2];
    expect(added.id).toBe(3); // id incrementado
    expect(added.name).toBe("Novo Paciente");
    expect(added.cpf).toBe("111.222.333-44");

    // Verifica redirecionamento
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("cancela e redireciona corretamente", () => {
    render(<CreatePatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("atribui id corretamente quando patientsMock estiver vazio", () => {
    patientsMock.length = 0;
    render(<CreatePatientPage />);
    fireEvent.change(screen.getByLabelText(/Nome:/i), { target: { value: "Paciente Único" } });
    fireEvent.change(screen.getByLabelText(/CPF:/i), { target: { value: "000.000.000-00" } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento:/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/Sexo:/i), { target: { value: "Masculino" } });
    fireEvent.change(screen.getByLabelText(/Endereço:/i), { target: { value: "Rua Única, 1" } });

    fireEvent.submit(screen.getByRole("button", { name: /Salvar/i }));
    expect(patientsMock[0].id).toBe(1);
  });
});
