// src/app/patient/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DetailsPatientPage from "./page";
import { patientsMock } from "../../../mocks/patients";
import { useRouter, useParams } from "next/navigation";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("DetailsPatientPage", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("deve exibir mensagem de carregando/paciente não encontrado se paciente não existir", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" }); // id inexistente
    render(<DetailsPatientPage />);
    expect(screen.getByText(/Paciente não encontrado ou carregando/i)).toBeInTheDocument();
  });

  it("deve renderizar detalhes do paciente corretamente", () => {
    render(<DetailsPatientPage />);
    const patient = patientsMock.find((p) => p.id === 1)!;

    expect(screen.getByText(/Detalhes do Paciente/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.name, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.gender, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.phone, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(patient.email, "i"))).toBeInTheDocument();
  });

  it("deve navegar para página de edição ao clicar em Editar", () => {
    render(<DetailsPatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Editar/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient/edit/1");
  });

  it("deve navegar para listagem ao clicar em Voltar para a Lista", () => {
    render(<DetailsPatientPage />);
    fireEvent.click(screen.getByRole("button", { name: /Voltar para a Lista/i }));
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
