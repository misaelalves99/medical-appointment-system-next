// src/app/patient/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EditPatientPage from "./page";
import { patientsMock } from "../../../mocks/patients";
import { useRouter, useParams } from "next/navigation";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("EditPatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("exibe mensagem de paciente não encontrado se ID não existir", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" }); // id inexistente
    render(<EditPatientPage />);
    expect(screen.getByText(/Paciente não encontrado/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Voltar/i })).toBeInTheDocument();
  });

  it("renderiza formulário preenchido com dados do paciente existente", () => {
    render(<EditPatientPage />);
    const patient = patientsMock.find((p) => p.id === 1)!;

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
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("volta para a listagem ao clicar no botão Voltar", () => {
    render(<EditPatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Voltar/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
