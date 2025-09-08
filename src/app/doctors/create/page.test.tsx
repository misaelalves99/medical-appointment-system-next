// src/app/doctors/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreateDoctorPage from "./page";
import "@testing-library/jest-dom";

// Mock do router do Next.js
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock dos hooks
const addDoctorMock = jest.fn();
const specialtiesMock = [
  { id: 1, name: "Cardiologia", isActive: true },
  { id: 2, name: "Neurologia", isActive: true },
];

jest.mock("../../hooks/useDoctor", () => ({
  useDoctor: () => ({
    doctors: [],
    addDoctor: addDoctorMock,
  }),
}));

jest.mock("../../hooks/useSpecialty", () => ({
  useSpecialty: () => ({
    specialties: specialtiesMock,
  }),
}));

describe("CreateDoctorPage", () => {
  beforeEach(() => {
    pushMock.mockClear();
    addDoctorMock.mockClear();
  });

  it("renderiza todos os campos do formulário corretamente", () => {
    render(<CreateDoctorPage />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/crm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/especialidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ativo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  it("permite preencher o formulário e alterar o estado corretamente", () => {
    render(<CreateDoctorPage />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "Dr. Teste" } });
    fireEvent.change(screen.getByLabelText(/crm/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText(/especialidade/i), { target: { value: "Cardiologia" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "teste@ex.com" } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: "999999999" } });
    fireEvent.click(screen.getByLabelText(/ativo/i));

    expect((screen.getByLabelText(/nome/i) as HTMLInputElement).value).toBe("Dr. Teste");
    expect((screen.getByLabelText(/crm/i) as HTMLInputElement).value).toBe("12345");
    expect((screen.getByLabelText(/especialidade/i) as HTMLSelectElement).value).toBe("Cardiologia");
    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe("teste@ex.com");
    expect((screen.getByLabelText(/telefone/i) as HTMLInputElement).value).toBe("999999999");
    expect((screen.getByLabelText(/ativo/i) as HTMLInputElement).checked).toBe(true);
  });

  it("chama addDoctor e router.push ao enviar o formulário", () => {
    render(<CreateDoctorPage />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "Dr. Teste" } });
    fireEvent.change(screen.getByLabelText(/crm/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText(/especialidade/i), { target: { value: "Cardiologia" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "teste@ex.com" } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: "999999999" } });
    fireEvent.click(screen.getByLabelText(/ativo/i));

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(addDoctorMock).toHaveBeenCalledWith(expect.objectContaining({
      name: "Dr. Teste",
      crm: "12345",
      specialty: "Cardiologia",
      email: "teste@ex.com",
      phone: "999999999",
      isActive: true,
    }));
    expect(pushMock).toHaveBeenCalledWith("/doctors");
  });

  it("botão cancelar chama router.push para /doctors", () => {
    render(<CreateDoctorPage />);
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith("/doctors");
  });

  it("popula corretamente o select de especialidades", () => {
    render(<CreateDoctorPage />);
    specialtiesMock.forEach(s => {
      expect(screen.getByRole("option", { name: s.name })).toBeInTheDocument();
    });
  });

  it("permite desmarcar o checkbox 'Ativo'", () => {
    render(<CreateDoctorPage />);
    const checkbox = screen.getByLabelText(/ativo/i) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
