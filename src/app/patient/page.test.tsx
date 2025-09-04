// src/app/patient/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import PatientIndex from "./page";
import { patientsMock } from "../mocks/patients";
import { useRouter } from "next/navigation";

// Mock do Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("PatientIndex Page", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renderiza título e link para cadastrar", () => {
    render(<PatientIndex />);
    expect(screen.getByText("Pacientes")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Cadastrar Novo Paciente/i })
    ).toHaveAttribute("href", "/patient/create");
  });

  it("renderiza pacientes do mock", () => {
    render(<PatientIndex />);
    patientsMock.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getByText(p.cpf)).toBeInTheDocument();
      expect(screen.getByText(p.phone || "-")).toBeInTheDocument();
    });
  });

  it("filtra pacientes pelo nome", () => {
    render(<PatientIndex />);
    const searchInput = screen.getByPlaceholderText(
      /Pesquisar por ID, Nome, CPF ou Telefone/i
    );
    fireEvent.change(searchInput, { target: { value: patientsMock[0].name } });

    expect(screen.getByText(patientsMock[0].name)).toBeInTheDocument();
    // Outros pacientes não aparecem
    patientsMock.slice(1).forEach((p) => {
      expect(screen.queryByText(p.name)).not.toBeInTheDocument();
    });
  });

  it("exibe mensagem quando nenhum paciente é encontrado", () => {
    render(<PatientIndex />);
    const searchInput = screen.getByPlaceholderText(
      /Pesquisar por ID, Nome, CPF ou Telefone/i
    );
    fireEvent.change(searchInput, { target: { value: "naoexiste" } });
    expect(screen.getByText("Nenhum paciente encontrado.")).toBeInTheDocument();
  });

  it("executa router.push ao clicar nos botões de ação", () => {
    render(<PatientIndex />);
    const firstPatient = patientsMock[0];

    fireEvent.click(screen.getAllByText("Detalhes")[0]);
    expect(pushMock).toHaveBeenCalledWith(`/patient/details/${firstPatient.id}`);

    fireEvent.click(screen.getAllByText("Editar")[0]);
    expect(pushMock).toHaveBeenCalledWith(`/patient/edit/${firstPatient.id}`);

    fireEvent.click(screen.getAllByText("Excluir")[0]);
    expect(pushMock).toHaveBeenCalledWith(`/patient/delete/${firstPatient.id}`);
  });
});
