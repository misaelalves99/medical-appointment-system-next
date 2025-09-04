// src/app/doctors/edit/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditDoctorPage from "./page";

const mockPush = jest.fn();
const mockUpdateDoctor = jest.fn();

let mockParams: Record<string, string> = {};

jest.mock("next/navigation", () => ({
  useParams: () => mockParams,
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../../../hooks/useDoctor", () => ({
  useDoctor: () => ({
    doctors: [
      {
        id: 1,
        name: "Dr. Teste",
        crm: "12345",
        specialty: "Cardiologia",
        email: "teste@ex.com",
        phone: "999999999",
        isActive: true,
      },
    ],
    updateDoctor: mockUpdateDoctor,
  }),
}));

jest.mock("../../../hooks/useSpecialty", () => ({
  useSpecialty: () => ({
    specialties: [
      { id: 1, name: "Cardiologia" },
      { id: 2, name: "Neurologia" },
    ],
  }),
}));

describe("EditDoctorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza campos preenchidos com os dados do doctor", async () => {
    mockParams = { id: "1" };

    render(<EditDoctorPage />);

    expect(await screen.findByDisplayValue("Dr. Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12345")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Cardiologia")).toBeInTheDocument();
    expect(screen.getByDisplayValue("teste@ex.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("999999999")).toBeInTheDocument();
    expect((screen.getByLabelText(/Ativo/i) as HTMLInputElement).checked).toBe(true);
  });

  it("permite editar campos do formulário", async () => {
    mockParams = { id: "1" };

    render(<EditDoctorPage />);

    const nameInput = await screen.findByDisplayValue("Dr. Teste");
    fireEvent.change(nameInput, { target: { value: "Novo Nome" } });

    expect((nameInput as HTMLInputElement).value).toBe("Novo Nome");
  });

  it("chama updateDoctor e navega ao salvar alterações", async () => {
    mockParams = { id: "1" };

    render(<EditDoctorPage />);

    const nameInput = await screen.findByDisplayValue("Dr. Teste");
    fireEvent.change(nameInput, { target: { value: "Nome Atualizado" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar Alterações/i }));

    await waitFor(() => {
      expect(mockUpdateDoctor).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Nome Atualizado" })
      );
      expect(mockPush).toHaveBeenCalledWith("/doctors");
    });
  });

  it("navega para /doctors ao clicar em Cancelar", async () => {
    mockParams = { id: "1" };

    render(<EditDoctorPage />);

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(mockPush).toHaveBeenCalledWith("/doctors");
  });
});
