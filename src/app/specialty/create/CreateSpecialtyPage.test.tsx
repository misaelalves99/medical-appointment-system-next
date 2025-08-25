// src/app/specialty/create/__tests__/CreateSpecialtyPage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreateSpecialtyPage from "../page";
import { specialtiesMock } from "../../mocks/specialties";

describe("CreateSpecialtyPage", () => {
  beforeEach(() => {
    specialtiesMock.length = 0; // limpar mock antes de cada teste
  });

  it("deve renderizar título e formulário", () => {
    render(<CreateSpecialtyPage />);
    expect(
      screen.getByRole("heading", { name: /cadastrar nova especialidade/i })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/nome da especialidade/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  it("deve permitir digitar e submeter uma nova especialidade", () => {
    render(<CreateSpecialtyPage />);

    const input = screen.getByLabelText(/nome da especialidade/i);
    const button = screen.getByRole("button", { name: /salvar/i });

    fireEvent.change(input, { target: { value: "Neurologia" } });
    expect(input).toHaveValue("Neurologia");

    fireEvent.click(button);

    // Verifica se adicionou ao mock
    expect(specialtiesMock).toHaveLength(1);
    expect(specialtiesMock[0]).toMatchObject({ id: 1, name: "Neurologia" });

    // Verifica se resetou o campo
    expect(input).toHaveValue("");
  });

  it("não deve adicionar se o nome estiver vazio", () => {
    render(<CreateSpecialtyPage />);
    const button = screen.getByRole("button", { name: /salvar/i });

    fireEvent.click(button);

    expect(specialtiesMock).toHaveLength(0);
  });
});
