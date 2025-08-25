// src/components/Error.test.tsx

import { render, screen } from "@testing-library/react";
import Error from "./Error";
import "@testing-library/jest-dom";

describe("Error Component", () => {
  it("renderiza título e mensagem de erro", () => {
    render(<Error />);

    expect(screen.getByText("Ocorreu um erro")).toBeInTheDocument();
    expect(
      screen.getByText("Desculpe, ocorreu um erro ao processar sua solicitação.")
    ).toBeInTheDocument();
  });

  it("possui link de retorno para a Home", () => {
    render(<Error />);
    const link = screen.getByRole("link", { name: /voltar para a home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
