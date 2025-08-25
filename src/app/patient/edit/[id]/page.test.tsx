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

  it("deve exibir mensagem de carregando se paciente não existir", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });
    render(<EditPatientPage />);
    expect(screen.getByText(/Carregando paciente/i)).toBeInTheDocument();
  });

  it("deve renderizar formulário preenchido com os dados do paciente", () => {
    render(<EditPatientPage />);
    const patient = patientsMock.find((p) => p.id === 1)!;

    expect(screen.getByDisplayValue(patient.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.cpf || "")).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.dateOfBirth)).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.email || "")).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.phone || "")).toBeInTheDocument();
    expect(screen.getByDisplayValue(patient.address || "")).toBeInTheDocument();
  });

  it("deve atualizar dados do formulário ao alterar valores", () => {
    render(<EditPatientPage />);
    const inputName = screen.getByLabelText(/Nome:/i) as HTMLInputElement;
    fireEvent.change(inputName, { target: { value: "Novo Nome" } });
    expect(inputName.value).toBe("Novo Nome");
  });

  it("deve salvar alterações e redirecionar ao enviar o formulário", () => {
    render(<EditPatientPage />);
    const form = screen.getByRole("form", { hidden: true }) || screen.getByText(/Salvar Alterações/i).closest("form")!;
    fireEvent.submit(form);
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("deve voltar para listagem ao clicar no botão Voltar", () => {
    render(<EditPatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Voltar/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
