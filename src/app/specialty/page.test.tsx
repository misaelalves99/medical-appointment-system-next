// src/app/specialty/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import SpecialtyIndex from "./page";
import { specialtiesMock } from "../mocks/specialties";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SpecialtyIndex", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    specialtiesMock.splice(0, specialtiesMock.length, 
      { id: 1, name: "Cardiologia" },
      { id: 2, name: "Dermatologia" }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar a lista de especialidades", () => {
    render(<SpecialtyIndex />);
    expect(screen.getByText("Especialidades")).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.getByText("Dermatologia")).toBeInTheDocument();
  });

  it("deve navegar para a página de criação ao clicar em 'Cadastrar Nova Especialidade'", () => {
    render(<SpecialtyIndex />);
    fireEvent.click(screen.getByText("Cadastrar Nova Especialidade"));
    expect(pushMock).toHaveBeenCalledWith("/specialty/create");
  });

  it("deve filtrar especialidades pelo nome", () => {
    render(<SpecialtyIndex />);
    fireEvent.change(screen.getByLabelText("Pesquisar especialidades"), {
      target: { value: "Cardio" },
    });
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.queryByText("Dermatologia")).not.toBeInTheDocument();
  });

  it("deve exibir mensagem quando nenhuma especialidade for encontrada", () => {
    render(<SpecialtyIndex />);
    fireEvent.change(screen.getByLabelText("Pesquisar especialidades"), {
      target: { value: "Inexistente" },
    });
    expect(
      screen.getByText("Nenhuma especialidade encontrada.")
    ).toBeInTheDocument();
  });

  it("deve excluir uma especialidade ao confirmar", () => {
    render(<SpecialtyIndex />);
    fireEvent.click(screen.getAllByText("Excluir")[0]);
    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
    expect(specialtiesMock.find((s) => s.name === "Cardiologia")).toBeUndefined();
  });

  it("deve navegar para detalhes da especialidade", () => {
    render(<SpecialtyIndex />);
    fireEvent.click(screen.getAllByText("Detalhes")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/details/1");
  });

  it("deve navegar para edição da especialidade", () => {
    render(<SpecialtyIndex />);
    fireEvent.click(screen.getAllByText("Editar")[0]);
    expect(pushMock).toHaveBeenCalledWith("/specialty/edit/1");
  });
});
