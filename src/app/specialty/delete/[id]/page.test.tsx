// src/app/specialty/delete/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DeleteSpecialtyPage from "./page";
import { specialtiesMock } from "../../../mocks/specialties";

// Mock do Next.js router e params
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ id: "1" }),
}));

describe("DeleteSpecialtyPage", () => {
  beforeEach(() => {
    specialtiesMock.length = 0;
    specialtiesMock.push(
      { id: 1, name: "Cardiologia" },
      { id: 2, name: "Dermatologia" }
    );
    pushMock.mockClear();
  });

  it("deve renderizar informações da especialidade", () => {
    render(<DeleteSpecialtyPage />);
    expect(
      screen.getByRole("heading", { name: /excluir especialidade/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tem certeza que deseja excluir/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
  });

  it("deve excluir a especialidade e redirecionar", () => {
    render(<DeleteSpecialtyPage />);
    fireEvent.click(screen.getByRole("button", { name: /excluir/i }));

    expect(specialtiesMock).toHaveLength(1);
    expect(specialtiesMock.find((s) => s.id === 1)).toBeUndefined();
    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });

  it("deve cancelar e redirecionar sem excluir", () => {
    render(<DeleteSpecialtyPage />);
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(specialtiesMock).toHaveLength(2);
    expect(pushMock).toHaveBeenCalledWith("/specialty");
  });
});
