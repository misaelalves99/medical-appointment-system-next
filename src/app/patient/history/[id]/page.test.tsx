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

  it("exibe mensagem quando não houver histórico para o paciente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" }); // id inexistente
    render(<HistoryPatientPage />);
    expect(screen.getByText(/Nenhum registro encontrado/i)).toBeInTheDocument();
  });

  it("exibe histórico do paciente corretamente, ordenado por data decrescente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<HistoryPatientPage />);

    const patientHistory = patientsHistoryMock
      .filter(h => h.patientId === 1)
      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());

    // Verifica se todas as linhas estão na tela
    patientHistory.forEach(item => {
      expect(screen.getByText(new Date(item.recordDate).toLocaleDateString("pt-BR"))).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
      expect(screen.getByText(item.notes || "-")).toBeInTheDocument();
    });

    // Verifica a ordem: primeira linha deve ser a mais recente
    const firstRowDate = screen.getAllByRole("cell")[0].textContent;
    expect(firstRowDate).toBe(new Date(patientHistory[0].recordDate).toLocaleDateString("pt-BR"));
  });

  it("mostra '-' quando notas estiverem vazias ou nulas", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "2" }); // paciente com notas possivelmente nulas
    render(<HistoryPatientPage />);
    const patientHistory = patientsHistoryMock.filter(h => h.patientId === 2);
    patientHistory.forEach(item => {
      expect(screen.getByText(item.notes || "-")).toBeInTheDocument();
    });
  });

  it("exibe link de voltar corretamente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<HistoryPatientPage />);
    const backLink = screen.getByRole("link", { name: /Voltar/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/patient");
  });

});
