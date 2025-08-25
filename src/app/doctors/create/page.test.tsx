// src/app/doctors/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreateDoctor from "./page";
import "@testing-library/jest-dom";
import { doctorsMock } from "../../mocks/doctors";

// Mock do router do Next.js
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("CreateDoctor", () => {
  beforeEach(() => {
    doctorsMock.length = 0; // resetar mock antes de cada teste
    pushMock.mockClear();
  });

  it("renderiza todos os campos do formulário", () => {
    render(<CreateDoctor />);
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/crm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/especialidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ativo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  it("permite preencher o formulário e atualizar o estado", () => {
    render(<CreateDoctor />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "Dr. Teste" } });
    fireEvent.change(screen.getByLabelText(/crm/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText(/especialidade/i), { target: { value: "Cardiologia" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "teste@ex.com" } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: "999999999" } });
    fireEvent.click(screen.getByLabelText(/ativo/i));

    expect((screen.getByLabelText(/nome/i) as HTMLInputElement).value).toBe("Dr. Teste");
    expect((screen.getByLabelText(/crm/i) as HTMLInputElement).value).toBe("12345");
    expect((screen.getByLabelText(/especialidade/i) as HTMLInputElement).value).toBe("Cardiologia");
    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe("teste@ex.com");
    expect((screen.getByLabelText(/telefone/i) as HTMLInputElement).value).toBe("999999999");
    expect((screen.getByLabelText(/ativo/i) as HTMLInputElement).checked).toBe(true);
  });

  it("adiciona novo médico ao doctorsMock e chama router.push ao enviar o formulário", () => {
    render(<CreateDoctor />);
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: "Dr. Teste" } });
    fireEvent.change(screen.getByLabelText(/crm/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByLabelText(/especialidade/i), { target: { value: "Cardiologia" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "teste@ex.com" } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: "999999999" } });
    fireEvent.click(screen.getByLabelText(/ativo/i));

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(doctorsMock.length).toBe(1);
    expect(doctorsMock[0].name).toBe("Dr. Teste");
    expect(pushMock).toHaveBeenCalledWith("/doctors");
  });

  it("botão cancelar chama router.push para /doctors", () => {
    render(<CreateDoctor />);
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(pushMock).toHaveBeenCalledWith("/doctors");
  });
});
