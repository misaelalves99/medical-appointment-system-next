// src/app/specialty/details/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DetailsSpecialtyPage from "./page";
import { specialtiesMock } from "../../../mocks/specialties";

const pushMock = jest.fn();

// Mock do Next.js router e params
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ id: "1" }),
}));

describe("DetailsSpecialtyPage", () => {
  beforeEach(() => {
    specialtiesMock.length = 0;
    specialtiesMock.push({ id: 1, name: "Cardiologia" });
    pushMock.mockClear();
  });

  it("deve renderizar os detalhes da especialidade", () => {
    render(<DetailsSpecialtyPage />);
    expect(screen.getByText(/detalhes da especialidade/i)).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("deve redirecionar para edição ao clicar em Editar", () => {
    render(<DetailsSpecialtyPage />);
    fireEvent.click(screen.getByRole("button", { name: /editar/i }));
    expect(pushMock).toHaveBeenCalledWith("/specialty/edit/1");
  });

  it("deve redirecionar para lista ao clicar em Voltar", () => {
    render(<DetailsSpecialtyPage />);
    fireEvent.click(screen.getByRole("button", { name: /voltar para a lista/i }));
    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });

  it("deve exibir carregando quando a especialidade não existe", () => {
    jest.mocked(pushMock).mockClear();
    jest.mock("next/navigation", () => ({
      useRouter: () => ({ push: pushMock }),
      useParams: () => ({ id: "999" }),
    }));
    render(<DetailsSpecialtyPage />);
    expect(screen.getByText(/carregando especialidade/i)).toBeInTheDocument();
  });
});
