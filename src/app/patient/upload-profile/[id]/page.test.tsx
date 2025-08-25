// src/app/patient/upload-profile/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import UploadProfilePicturePage from "./page";
import { patientsMock } from "../../../mocks/patients";
import { useRouter, useParams } from "next/navigation";

// Mock do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("UploadProfilePicturePage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    pushMock.mockClear();
  });

  it("deve exibir mensagem quando paciente não encontrado", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });
    render(<UploadProfilePicturePage />);
    expect(screen.getByText(/Paciente não encontrado/i)).toBeInTheDocument();
  });

  it("deve exibir informações do paciente e botão de enviar desabilitado inicialmente", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<UploadProfilePicturePage />);
    expect(screen.getByText(new RegExp(patientsMock[0].name))).toBeInTheDocument();
    const submitButton = screen.getByRole("button", { name: /Enviar Foto/i });
    expect(submitButton).toBeDisabled();
  });

  it("deve habilitar botão quando um arquivo é selecionado", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<UploadProfilePicturePage />);
    const fileInput = screen.getByLabelText(/Selecionar Foto/i) as HTMLInputElement;

    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files?.[0]).toBe(file);
    const submitButton = screen.getByRole("button", { name: /Enviar Foto/i });
    expect(submitButton).not.toBeDisabled();
  });

  it("deve simular envio e redirecionar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<UploadProfilePicturePage />);
    const fileInput = screen.getByLabelText(/Selecionar Foto/i) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /Enviar Foto/i });

    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Mock window.alert
    window.alert = jest.fn();
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining(patientsMock[0].name)
    );
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });

  it("botão de voltar deve chamar router.push", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<UploadProfilePicturePage />);
    const backButton = screen.getByRole("button", { name: /Voltar/i });
    fireEvent.click(backButton);
    expect(pushMock).toHaveBeenCalledWith("/patient");
  });
});
