// src/app/specialty/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import SpecialtyList from "./page";
import { useSpecialty } from "../hooks/useSpecialty";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../hooks/useSpecialty", () => ({
  useSpecialty: jest.fn(),
}));

describe("SpecialtyList", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (useSpecialty as jest.Mock).mockReturnValue({
      specialties: [
        { id: 1, name: "Cardiologia", isActive: true },
        { id: 2, name: "Dermatologia", isActive: true },
      ],
    });

    pushMock.mockClear();
  });

  it("deve renderizar a lista de especialidades", () => {
    render(<SpecialtyList />);
    expect(screen.getByText("Especialidades")).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.getByText("Dermatologia")).toBeInTheDocument();
  });

  it("deve navegar para a página de criação ao clicar em 'Nova Especialidade'", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getByText("Nova Especialidade"));
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
    expect(screen.getByText("Nenhuma especialidade encontrada.")).toBeInTheDocument();
  });

  it("deve navegar para detalhes da especialidade", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getAllByTitle("Detalhes")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/details/1");
  });

  it("deve navegar para edição da especialidade", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getAllByTitle("Editar")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/edit/1");
  });

  it("deve navegar para a página de exclusão da especialidade", () => {
    render(<SpecialtyList />);
    fireEvent.click(screen.getAllByTitle("Excluir")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/delete/1");
  });
});
