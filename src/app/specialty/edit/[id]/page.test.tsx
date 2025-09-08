// src/app/specialty/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EditSpecialtyPage from "./page";
import * as nextNavigation from "next/navigation";

const pushMock = jest.fn();

// Mock do hook useSpecialty
let specialtiesMock = [{ id: 1, name: "Cardiologia" }];
const updateSpecialtyMock = jest.fn((id: number, name: string) => {
  const s = specialtiesMock.find((sp) => sp.id === id);
  if (s) s.name = name;
});

jest.mock("../../../hooks/useSpecialty", () => ({
  useSpecialty: () => ({
    specialties: specialtiesMock,
    updateSpecialty: updateSpecialtyMock,
  }),
}));

// Mock do Next.js router e params
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ id: "1" }),
}));

describe("EditSpecialtyPage", () => {
  beforeEach(() => {
    specialtiesMock = [{ id: 1, name: "Cardiologia" }];
    pushMock.mockClear();
    updateSpecialtyMock.mockClear();
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
    jest.spyOn(nextNavigation, "useParams").mockReturnValue({ id: "999" });

    render(<EditSpecialtyPage />);
    expect(screen.getByText(/especialidade não encontrada/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });

  // TESTE EXTRA: garante que o input é atualizado se a especialidade mudar
  it("atualiza o input quando a especialidade muda via useEffect", () => {
    const { rerender } = render(<EditSpecialtyPage />);
    const input = screen.getByLabelText(/nome da especialidade/i) as HTMLInputElement;

    expect(input.value).toBe("Cardiologia");

    // Simula mudança de especialidade
    specialtiesMock = [{ id: 1, name: "Neurologia" }];
    rerender(<EditSpecialtyPage />);

    expect(screen.getByDisplayValue("Neurologia")).toBeInTheDocument();
  });
});
