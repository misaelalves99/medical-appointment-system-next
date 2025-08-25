// src/app/patient/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import PatientIndex from "../../../src/app/patient/page";
import { patientsMock } from "../../../src/app/mocks/patients";

describe("PatientIndex Page", () => {
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
      expect(screen.getByText(p.email)).toBeInTheDocument();
      expect(screen.getByText(p.phone)).toBeInTheDocument();
    });
  });

  it("filtra pacientes pelo nome", () => {
    render(<PatientIndex />);

    const searchInput = screen.getByPlaceholderText(
      /Pesquisar por Nome, CPF, Email ou Telefone/i
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
      /Pesquisar por Nome, CPF, Email ou Telefone/i
    );
    fireEvent.change(searchInput, { target: { value: "naoexiste" } });

    expect(screen.getByText("Nenhum paciente encontrado.")).toBeInTheDocument();
  });

  it("renderiza links de ação para cada paciente", () => {
    render(<PatientIndex />);

    patientsMock.forEach((p) => {
      expect(
        screen.getByRole("link", { name: /Detalhes/i })
      ).toHaveAttribute("href", `/patient/details/${p.id}`);

      expect(
        screen.getByRole("link", { name: /Editar/i })
      ).toHaveAttribute("href", `/patient/edit/${p.id}`);

      expect(
        screen.getByRole("link", { name: /Excluir/i })
      ).toHaveAttribute("href", `/patient/delete/${p.id}`);

      expect(
        screen.getByRole("link", { name: /Histórico/i })
      ).toHaveAttribute("href", `/patient/history/${p.id}`);

      expect(
        screen.getByRole("link", { name: /Upload Foto/i })
      ).toHaveAttribute("href", `/patient/upload-profile/${p.id}`);
    });
  });
});
