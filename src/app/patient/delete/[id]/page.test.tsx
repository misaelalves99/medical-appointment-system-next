// src/app/patient/delete/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeletePatientPage from "./page";
import { useRouter, useParams } from "next/navigation";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock do hook usePatient
const deletePatientMock = jest.fn();
const mockPatients = [
  { id: 1, name: "Carlos Oliveira" },
  { id: 2, name: "Maria Lima" },
];

jest.mock("../../../hooks/usePatient", () => ({
  usePatient: jest.fn(() => ({
    patients: mockPatients,
    deletePatient: deletePatientMock,
  })),
}));

describe("DeletePatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    deletePatientMock.mockClear();
  });

  it("exibe 'Carregando...' se paciente não encontrado", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });
    render(<DeletePatientPage />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it("renderiza detalhes do paciente corretamente", () => {
    render(<DeletePatientPage />);
    expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument();
    expect(screen.getByText(/Carlos Oliveira/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Excluir/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
  });

  it("chama deletePatient e redireciona ao clicar em Excluir", async () => {
    render(<DeletePatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Excluir/i }));

    await waitFor(() => {
      expect(deletePatientMock).toHaveBeenCalledWith(1);
      expect(pushMock).toHaveBeenCalledWith("/patient");
    });
  });

  it("não chama deletePatient e apenas redireciona ao clicar em Cancelar", () => {
    render(<DeletePatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(deletePatientMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("garante que o paciente correto está sendo exibido antes da exclusão", () => {
    render(<DeletePatientPage />);
    const confirmationText = screen.getByText(/Tem certeza de que deseja excluir o paciente/i);
    expect(confirmationText).toHaveTextContent("Carlos Oliveira");
  });
});
