// src/app/doctors/edit/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DoctorEditPage from "./page";

// mock de navegação do Next.js
const mockPush = jest.fn();
let mockParams: Record<string, string> = {};

jest.mock("next/navigation", () => ({
  useParams: () => mockParams,
  useRouter: () => ({ push: mockPush }),
}));

// mock local dos doctors
import {
  doctorsMock as originalDoctorsMock,
  Doctor,
} from "../../../mocks/doctors";

describe("DoctorEditPage", () => {
  let doctorsMock: Doctor[];

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {}; // reseta params
    // cria uma cópia isolada do mock para não mutar o original
    doctorsMock = JSON.parse(JSON.stringify(originalDoctorsMock));
  });

  it("exibe 'Carregando médico...' se não encontrar o médico", () => {
    mockParams = { id: "999" }; // id inexistente

    render(<DoctorEditPage />);

    expect(screen.getByText(/Carregando médico/i)).toBeInTheDocument();
  });

  it("carrega e exibe os dados do médico para edição", async () => {
    const doctor = doctorsMock[0];
    mockParams = { id: doctor.id.toString() };

    render(<DoctorEditPage />);

    expect(await screen.findByDisplayValue(doctor.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(doctor.crm)).toBeInTheDocument();
    expect(screen.getByDisplayValue(doctor.specialty)).toBeInTheDocument();
    expect(screen.getByDisplayValue(doctor.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(doctor.phone)).toBeInTheDocument();
  });

  it("permite editar campos do formulário", async () => {
    const doctor = doctorsMock[0];
    mockParams = { id: doctor.id.toString() };

    render(<DoctorEditPage />);

    const nameInput = await screen.findByDisplayValue(doctor.name);
    fireEvent.change(nameInput, { target: { value: "Novo Nome" } });

    expect((nameInput as HTMLInputElement).value).toBe("Novo Nome");
  });

  it("salva alterações e redireciona ao clicar em 'Salvar Alterações'", async () => {
    const doctor = { ...doctorsMock[0] };
    mockParams = { id: doctor.id.toString() };

    render(<DoctorEditPage />);

    const nameInput = await screen.findByDisplayValue(doctor.name);
    fireEvent.change(nameInput, { target: { value: "Nome Atualizado" } });

    const submitButton = screen.getByRole("button", {
      name: /Salvar Alterações/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/doctors");
    });
  });

  it("cancela edição e redireciona ao clicar em 'Cancelar'", async () => {
    const doctor = doctorsMock[0];
    mockParams = { id: doctor.id.toString() };

    render(<DoctorEditPage />);

    const cancelButton = await screen.findByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith("/doctors");
  });
});
