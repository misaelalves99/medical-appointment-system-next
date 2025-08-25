// src/app/specialty/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EditSpecialtyPage from "./page";
import { specialtiesMock } from "../../../mocks/specialties";

const pushMock = jest.fn();

// Mock do Next.js router e params
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ id: "1" }),
}));

describe("EditSpecialtyPage", () => {
  beforeEach(() => {
    specialtiesMock.length = 0;
    specialtiesMock.push({ id: 1, name: "Cardiologia" });
    pushMock.mockClear();
  });

  it("deve renderizar o formulário com o nome da especialidade", () => {
    render(<EditSpecialtyPage />);
    expect(screen.getByText(/editar especialidade/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Cardiologia")).toBeInTheDocument();
  });

  it("deve mostrar erro ao tentar salvar com campo vazio", () => {
    render(<EditSpecialtyPage />);
    const input = screen.getByLabelText(/nome da especialidade/i);
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.submit(screen.getByRole("button", { name: /salvar alterações/i }));
    expect(
      screen.getByText(/o nome da especialidade é obrigatório/i)
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("deve atualizar a especialidade e redirecionar ao salvar", () => {
    render(<EditSpecialtyPage />);
    const input = screen.getByLabelText(/nome da especialidade/i);
    fireEvent.change(input, { target: { value: "Dermatologia" } });
    fireEvent.submit(screen.getByRole("button", { name: /salvar alterações/i }));

    expect(specialtiesMock[0].name).toBe("Dermatologia");
    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });

  it("deve voltar para lista ao clicar em Voltar", () => {
    render(<EditSpecialtyPage />);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });

  it("deve exibir carregando quando a especialidade não existe", () => {
    jest.mock("next/navigation", () => ({
      useRouter: () => ({ push: pushMock }),
      useParams: () => ({ id: "999" }),
    }));

    render(<EditSpecialtyPage />);
    expect(screen.getByText(/carregando especialidade/i)).toBeInTheDocument();
  });
});
