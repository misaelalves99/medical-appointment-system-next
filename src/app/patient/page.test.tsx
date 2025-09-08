// src/app/patient/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import PatientIndex from "./page";
import { useRouter } from "next/navigation";

// Mock do Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock do hook usePatient
const mockPatients = [
  {
    id: 1,
    name: "Carlos Oliveira",
    cpf: "123.456.789-00",
    phone: "3333-3333",
  },
  {
    id: 2,
    name: "Maria Lima",
    cpf: "987.654.321-00",
    phone: "4444-4444",
  },
];

jest.mock("../hooks/usePatient", () => ({
  usePatient: jest.fn(() => ({
    patients: mockPatients,
  })),
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
    mockPatients.forEach((p) => {
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
    fireEvent.change(searchInput, { target: { value: mockPatients[0].name } });

    expect(screen.getByText(mockPatients[0].name)).toBeInTheDocument();
    // Outros pacientes não aparecem
    mockPatients.slice(1).forEach((p) => {
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
    const firstPatient = mockPatients[0];

    fireEvent.click(screen.getAllByText("Detalhes")[0]);
    expect(pushMock).toHaveBeenCalledWith(`/patient/details/${firstPatient.id}`);

    fireEvent.click(screen.getAllByText("Editar")[0]);
    expect(pushMock).toHaveBeenCalledWith(`/patient/edit/${firstPatient.id}`);

    fireEvent.click(screen.getAllByText("Excluir")[0]);
    expect(pushMock).toHaveBeenCalledWith(`/patient/delete/${firstPatient.id}`);
  });
});
