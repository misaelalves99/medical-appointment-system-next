// src/app/doctors/delete/[id]/page.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteDoctorPage from "./page";
import "@testing-library/jest-dom";
import { Doctor } from "../../../types/Doctor";

// Mock do router do Next.js
const pushMock = jest.fn();

// Mock do hook useDoctor
const removeDoctorMock = jest.fn();
jest.mock("../../../hooks/useDoctor", () => ({
  useDoctor: () => ({
    doctors: [{ id: 1, name: "Dr. Teste", crm: "12345", specialty: "Cardiologia", email: "teste@ex.com", phone: "999999999", isActive: true }],
    removeDoctor: removeDoctorMock,
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

import { useRouter, useParams } from "next/navigation";

describe("DeleteDoctorPage", () => {
  beforeEach(() => {
    pushMock.mockClear();
    removeDoctorMock.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("exibe loading inicialmente se doctor não estiver definido", () => {
    jest.spyOn(React, "useState").mockReturnValueOnce([null, jest.fn()]);
    render(<DeleteDoctorPage />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renderiza corretamente os dados do médico", () => {
    render(<DeleteDoctorPage />);
    expect(screen.getByText(/confirmar exclusão/i)).toBeInTheDocument();
    expect(screen.getByText(/dr\. teste/i)).toBeInTheDocument();
  });

  it("chama removeDoctor e router.push ao clicar em Excluir", async () => {
    render(<DeleteDoctorPage />);
    fireEvent.click(screen.getByText(/excluir/i));

    await waitFor(() => {
      expect(removeDoctorMock).toHaveBeenCalledWith(1);
      expect(pushMock).toHaveBeenCalledWith("/doctors");
    });
  });

  it("chama router.push ao clicar em Cancelar", () => {
    render(<DeleteDoctorPage />);
    fireEvent.click(screen.getByText(/cancelar/i));
    expect(pushMock).toHaveBeenCalledWith("/doctors");
  });
});
