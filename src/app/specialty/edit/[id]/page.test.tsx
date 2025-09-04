// src/app/specialty/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EditSpecialtyPage from "./page";
import * as nextNavigation from "next/navigation";

const pushMock = jest.fn();

// Mock do hook useSpecialty
const specialtiesMock = [{ id: 1, name: "Cardiologia" }];
jest.mock("../../../hooks/useSpecialty", () => ({
  useSpecialty: () => ({
    specialties: specialtiesMock,
    updateSpecialty: (id: number, name: string) => {
      const s = specialtiesMock.find((sp) => sp.id === id);
      if (s) s.name = name;
    },
  }),
}));

// Mock do Next.js router e params
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ id: "1" }),
}));

describe("EditSpecialtyPage", () => {
  beforeEach(() => {
    specialtiesMock[0].name = "Cardiologia"; // reset mock
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

    expect(screen.getByText(/o nome da especialidade é obrigatório/i)).toBeInTheDocument();
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

  it("deve exibir mensagem quando a especialidade não existe", () => {
    // Sobrescreve useParams apenas neste teste
    jest.spyOn(nextNavigation, "useParams").mockReturnValue({ id: "999" });

    render(<EditSpecialtyPage />);

    expect(screen.getByText(/especialidade não encontrada/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });
});
