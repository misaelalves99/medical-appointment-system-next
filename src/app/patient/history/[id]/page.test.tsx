// src/app/patient/history/[id]/page.test.tsx

import { render, screen } from "@testing-library/react";
import HistoryPatientPage from "./page";
import { patientsHistoryMock } from "../../../mocks/patients";
import { useParams } from "next/navigation";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

describe("HistoryPatientPage", () => {
  it("deve exibir mensagem quando não houver histórico para o paciente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });
    render(<HistoryPatientPage />);
    expect(screen.getByText(/Nenhum registro encontrado/i)).toBeInTheDocument();
  });

  it("deve exibir histórico do paciente corretamente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<HistoryPatientPage />);
    const patientHistory = patientsHistoryMock
      .filter((h) => h.patientId === 1)
      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());

    // Verifica se todas as linhas do histórico estão na tela
    patientHistory.forEach((item) => {
      expect(screen.getByText(new Date(item.recordDate).toLocaleDateString("pt-BR"))).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
      expect(screen.getByText(item.notes || "-")).toBeInTheDocument();
    });
  });

  it("deve exibir link de voltar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<HistoryPatientPage />);
    const backLink = screen.getByRole("link", { name: /Voltar/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/patient");
  });
});
