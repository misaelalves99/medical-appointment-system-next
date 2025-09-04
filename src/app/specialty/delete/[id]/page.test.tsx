// src/app/specialty/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DeleteSpecialtyPage from "./page";
import * as nextNavigation from "next/navigation";

// Mock do hook useSpecialty
const removeSpecialtyMock = jest.fn();
const specialtiesMock = [
  { id: 1, name: "Cardiologia" },
  { id: 2, name: "Dermatologia" },
];

jest.mock("../../../hooks/useSpecialty", () => ({
  useSpecialty: () => ({
    specialties: specialtiesMock,
    removeSpecialty: removeSpecialtyMock,
  }),
}));

// Mock do Next.js
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ id: "1" }),
}));

describe("DeleteSpecialtyPage", () => {
  beforeEach(() => {
    removeSpecialtyMock.mockClear();
    pushMock.mockClear();
  });

  it("deve renderizar informações da especialidade", () => {
    render(<DeleteSpecialtyPage />);
    expect(
      screen.getByRole("heading", { name: /confirmar exclusão/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tem certeza de que deseja excluir/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
  });

  it("deve excluir a especialidade e redirecionar", () => {
    render(<DeleteSpecialtyPage />);
    fireEvent.click(screen.getByRole("button", { name: /excluir/i }));

    expect(removeSpecialtyMock).toHaveBeenCalledWith(1);
    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });

  it("deve cancelar e redirecionar sem excluir", () => {
    render(<DeleteSpecialtyPage />);
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(removeSpecialtyMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });

  it("deve exibir mensagem de carregando se id inválido", () => {
    jest.spyOn(nextNavigation, "useParams").mockReturnValue({ id: "999" });

    render(<DeleteSpecialtyPage />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });
});
