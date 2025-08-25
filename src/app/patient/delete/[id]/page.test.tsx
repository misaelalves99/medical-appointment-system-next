// src/app/patient/delete/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeletePatientPage from "./page";
import { patientsMock } from "../../../mocks/patients";
import { useRouter, useParams } from "next/navigation";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("DeletePatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    // Reset do mock de pacientes
    patientsMock.length = 2;
  });

  it("deve exibir carregando se paciente não encontrado ainda", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" }); // id inexistente
    render(<DeletePatientPage />);
    expect(screen.getByText(/Carregando paciente/i)).toBeInTheDocument();
  });

  it("deve renderizar detalhes do paciente corretamente", () => {
    render(<DeletePatientPage />);
    expect(screen.getByText(/Confirmar Exclusão/i)).toBeInTheDocument();
    expect(screen.getByText(/Carlos Oliveira/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Excluir/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
  });

  it("deve excluir paciente do mock e redirecionar ao clicar em Excluir", async () => {
    render(<DeletePatientPage />);
    expect(patientsMock.length).toBe(2);

    fireEvent.click(screen.getByRole("button", { name: /Excluir/i }));

    await waitFor(() => {
      expect(patientsMock.length).toBe(1);
      expect(patientsMock.find((p) => p.id === 1)).toBeUndefined();
      expect(pushMock).toHaveBeenCalledWith("/patient");
    });
  });

  it("deve redirecionar sem excluir ao clicar em Cancelar", () => {
    render(<DeletePatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    expect(patientsMock.length).toBe(2); // sem alterações
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
