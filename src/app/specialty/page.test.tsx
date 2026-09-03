import { fireEvent, render, screen } from "@testing-library/react";
import SpecialtyList from "./page";
import { useSpecialty } from "../hooks/useSpecialty";

jest.mock("../hooks/useSpecialty", () => ({
  useSpecialty: jest.fn(),
}));

describe("SpecialtyList", () => {
  const useSpecialtyMock = useSpecialty as jest.Mock;

  beforeEach(() => {
    useSpecialtyMock.mockReturnValue({
      specialties: [
        { id: 1, name: "Cardiologia", isActive: true },
        { id: 2, name: "Dermatologia", isActive: true },
      ],
    });
  });

  it("renderiza o workspace e a lista de especialidades", () => {
    render(<SpecialtyList />);

    expect(
      screen.getByRole("heading", { name: /gerenciamento de especialidades/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.getByText("Dermatologia")).toBeInTheDocument();
    expect(screen.getByText("2 resultados")).toBeInTheDocument();
  });

  it("expõe a ação de criação pela rota preservada", () => {
    render(<SpecialtyList />);

    expect(
      screen.getByRole("link", { name: /nova especialidade/i })
    ).toHaveAttribute("href", "/specialty/create");
  });

  it("filtra especialidades pelo nome", () => {
    render(<SpecialtyList />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /pesquisar especialidades/i }),
      { target: { value: "Cardio" } }
    );

    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.queryByText("Dermatologia")).not.toBeInTheDocument();
    expect(screen.getByText("1 resultado")).toBeInTheDocument();
  });

  it("filtra especialidades pelo ID", () => {
    render(<SpecialtyList />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /pesquisar especialidades/i }),
      { target: { value: "2" } }
    );

    expect(screen.getByText("Dermatologia")).toBeInTheDocument();
    expect(screen.queryByText("Cardiologia")).not.toBeInTheDocument();
  });

  it("diferencia pesquisa sem resultados de domínio vazio", () => {
    render(<SpecialtyList />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /pesquisar especialidades/i }),
      { target: { value: "Inexistente" } }
    );

    expect(
      screen.getByRole("heading", { name: /nenhum resultado encontrado/i })
    ).toBeInTheDocument();
    expect(screen.getByText("0 resultados")).toBeInTheDocument();
  });

  it("exibe estado vazio quando não existem especialidades", () => {
    useSpecialtyMock.mockReturnValue({ specialties: [] });

    render(<SpecialtyList />);

    expect(
      screen.getByRole("heading", { name: /nenhuma especialidade cadastrada/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /cadastrar especialidade/i })
    ).toHaveAttribute("href", "/specialty/create");
  });

  it("preserva as rotas de detalhes, edição e exclusão com nomes acessíveis", () => {
    render(<SpecialtyList />);

    expect(
      screen.getByRole("link", { name: /detalhes da especialidade cardiologia/i })
    ).toHaveAttribute("href", "/specialty/details/1");

    expect(
      screen.getByRole("link", { name: /editar especialidade cardiologia/i })
    ).toHaveAttribute("href", "/specialty/edit/1");

    expect(
      screen.getByRole("link", { name: /excluir especialidade cardiologia/i })
    ).toHaveAttribute("href", "/specialty/delete/1");
  });
});
