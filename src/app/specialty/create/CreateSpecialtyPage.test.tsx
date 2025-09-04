// src/app/specialty/create/__tests__/CreateSpecialtyPage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreateSpecialtyPage from "../page";

// Mock do useSpecialty
const addSpecialtyMock = jest.fn();
jest.mock("../../hooks/useSpecialty", () => ({
  useSpecialty: () => ({ addSpecialty: addSpecialtyMock }),
}));

// Mock do router do Next.js
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("CreateSpecialtyPage", () => {
  beforeEach(() => {
    addSpecialtyMock.mockClear();
    pushMock.mockClear();
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
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });

  it("deve permitir digitar e submeter uma nova especialidade", () => {
    render(<CreateSpecialtyPage />);

    const input = screen.getByLabelText(/nome da especialidade/i);
    const button = screen.getByRole("button", { name: /salvar/i });

    fireEvent.change(input, { target: { value: "Neurologia" } });
    expect(input).toHaveValue("Neurologia");

    fireEvent.click(button);

    // Verifica se addSpecialty foi chamado
    expect(addSpecialtyMock).toHaveBeenCalledWith("Neurologia");

    // Verifica se redirecionou
    expect(pushMock).toHaveBeenCalledWith("/specialty");

    // Input deve ser resetado após envio
    expect(input).toHaveValue("");
  });

  it("não deve adicionar se o nome estiver vazio", () => {
    render(<CreateSpecialtyPage />);
    const button = screen.getByRole("button", { name: /salvar/i });

    fireEvent.click(button);

    expect(addSpecialtyMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("deve voltar para listagem ao clicar em Voltar", () => {
    render(<CreateSpecialtyPage />);
    const buttonBack = screen.getByRole("button", { name: /voltar/i });

    fireEvent.click(buttonBack);

    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });
});
