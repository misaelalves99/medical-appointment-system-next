// src/app/specialty/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import SpecialtyList from "./page";
import { specialtiesMock } from "../mocks/specialties";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SpecialtyList", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Reset do mock com isActive incluído
    specialtiesMock.splice(0, specialtiesMock.length,
      { id: 1, name: "Cardiologia", isActive: true },
      { id: 2, name: "Dermatologia", isActive: true }
    );

    pushMock.mockClear();
  });

  it("deve renderizar a lista de especialidades", () => {
    render(<SpecialtyList />);
    expect(screen.getByText("Especialidades")).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.getByText("Dermatologia")).toBeInTheDocument();
  });

  it("deve navegar para a página de criação ao clicar em 'Cadastrar Nova Especialidade'", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getByText("Cadastrar Nova Especialidade"));
    expect(pushMock).toHaveBeenCalledWith("/specialty/create");
  });

  it("deve filtrar especialidades pelo nome", () => {
    render(<SpecialtyList />);
    fireEvent.change(screen.getByLabelText("Pesquisar especialidades"), {
      target: { value: "Cardio" },
    });
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.queryByText("Dermatologia")).not.toBeInTheDocument();
  });

  it("deve filtrar especialidades pelo ID", () => {
    render(<SpecialtyList />);
    fireEvent.change(screen.getByLabelText("Pesquisar especialidades"), {
      target: { value: "2" },
    });
    expect(screen.getByText("Dermatologia")).toBeInTheDocument();
    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
  });

  it("deve exibir mensagem quando nenhuma especialidade for encontrada", () => {
    render(<SpecialtyList />);
    fireEvent.change(screen.getByLabelText("Pesquisar especialidades"), {
      target: { value: "Inexistente" },
    });
    expect(
      screen.getByText("Nenhuma especialidade encontrada.")
    ).toBeInTheDocument();
  });

  it("deve navegar para detalhes da especialidade", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getAllByText("Detalhes")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/details/1");
  });

  it("deve navegar para edição da especialidade", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getAllByText("Editar")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/edit/1");
  });

  it("deve navegar para a página de exclusão da especialidade", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getAllByText("Excluir")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/delete/1");
  });
});
