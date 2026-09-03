import { fireEvent, render, screen } from "@testing-library/react";
import DoctorList from "./page";
import { doctorsMock } from "../mocks/doctors";

jest.mock("../hooks/useDoctor", () => ({
  useDoctor: () => ({ doctors: doctorsMock }),
}));

describe("DoctorList Page", () => {
  it("renderiza o workspace e a lista de médicos", () => {
    render(<DoctorList />);

    expect(
      screen.getByRole("heading", { name: /Gerenciamento de médicos/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Novo médico/i })
    ).toHaveAttribute("href", "/doctors/create");

    doctorsMock.forEach((doctor) => {
      expect(screen.getByText(doctor.name)).toBeInTheDocument();
    });

    ["ID", "Nome", "CRM", "Especialidade", "Status", "Ações"].forEach(
      (header) => {
        expect(
          screen.getByRole("columnheader", { name: header })
        ).toBeInTheDocument();
      }
    );
  });

  it("expõe pesquisa com rótulo e contagem de resultados", () => {
    render(<DoctorList />);

    expect(
      screen.getByRole("searchbox", { name: /Pesquisar médicos/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${doctorsMock.length} de ${doctorsMock.length} médicos`)
    ).toBeInTheDocument();
  });

  it("pesquisa médicos pelos campos do domínio", () => {
    render(<DoctorList />);

    const search = screen.getByRole("searchbox", {
      name: /Pesquisar médicos/i,
    });

    fireEvent.change(search, {
      target: { value: doctorsMock[0].email },
    });

    expect(screen.getByText(doctorsMock[0].name)).toBeInTheDocument();
    expect(screen.queryByText(doctorsMock[1].name)).not.toBeInTheDocument();
    expect(screen.getByText("1 de 2 médicos")).toBeInTheDocument();
  });

  it("distingue pesquisa sem resultados", () => {
    render(<DoctorList />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /Pesquisar médicos/i }),
      { target: { value: "profissional inexistente" } }
    );

    expect(
      screen.getByRole("heading", { name: /Nenhum resultado encontrado/i })
    ).toBeInTheDocument();
    expect(screen.getByText("0 de 2 médicos")).toBeInTheDocument();
  });

  it("expõe ações de linha com nomes acessíveis e rotas preservadas", () => {
    render(<DoctorList />);

    const doctor = doctorsMock[0];

    expect(
      screen.getByRole("link", {
        name: `Detalhes do médico ${doctor.name}`,
      })
    ).toHaveAttribute("href", `/doctors/details/${doctor.id}`);

    expect(
      screen.getByRole("link", {
        name: `Editar médico ${doctor.name}`,
      })
    ).toHaveAttribute("href", `/doctors/edit/${doctor.id}`);

    expect(
      screen.getByRole("link", {
        name: `Excluir médico ${doctor.name}`,
      })
    ).toHaveAttribute("href", `/doctors/delete/${doctor.id}`);
  });

  it("apresenta o status clínico de disponibilidade do cadastro", () => {
    render(<DoctorList />);

    doctorsMock.forEach((doctor) => {
      expect(
        screen.getAllByText(doctor.isActive ? "Ativo" : "Inativo").length
      ).toBeGreaterThan(0);
    });
  });

  it("apresenta estado vazio quando não há médicos", () => {
    const hookModule = jest.requireMock("../hooks/useDoctor") as {
      useDoctor: () => { doctors: typeof doctorsMock };
    };

    const originalUseDoctor = hookModule.useDoctor;
    hookModule.useDoctor = () => ({ doctors: [] });

    try {
      render(<DoctorList />);

      expect(
        screen.getByRole("heading", { name: /Nenhum médico cadastrado/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /Cadastrar médico/i })
      ).toHaveAttribute("href", "/doctors/create");
    } finally {
      hookModule.useDoctor = originalUseDoctor;
    }
  });
});
