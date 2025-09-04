// src/app/doctors/delete/[id]/page.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteDoctorPage from "./page";
import { doctorsMock, Doctor } from "./mocks/doctors";
import { useRouter, useParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("DeleteDoctorPage", () => {
  const pushMock = jest.fn();

  const mockDoctor: Doctor = {
    id: 1,
    name: "Dr. Teste",
    crm: "12345",
    specialty: "Cardiologia",
    email: "teste@ex.com",
    phone: "999999999",
    isActive: true,
  };

  beforeEach(() => {
    doctorsMock.length = 0;
    doctorsMock.push({ ...mockDoctor });
    pushMock.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("exibe mensagem de carregamento quando médico não encontrado", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });
    render(<DeleteDoctorPage />);
    expect(screen.getByText(/carregando médico/i)).toBeInTheDocument();
  });

  it("renderiza corretamente os dados do médico", () => {
    render(<DeleteDoctorPage />);
    expect(screen.getByText(mockDoctor.name)).toBeInTheDocument();
    expect(screen.getByText(mockDoctor.crm)).toBeInTheDocument();
    expect(screen.getByText(mockDoctor.specialty)).toBeInTheDocument();
    expect(screen.getByText(mockDoctor.email)).toBeInTheDocument();
    expect(screen.getByText(mockDoctor.phone)).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it("remove médico do doctorsMock e navega ao clicar em Excluir", async () => {
    render(<DeleteDoctorPage />);
    fireEvent.click(screen.getByText(/excluir/i));

    await waitFor(() => {
      expect(doctorsMock.find((d) => d.id === mockDoctor.id)).toBeUndefined();
      expect(pushMock).toHaveBeenCalledWith("/doctors");
    });
  });

  it("navega para /doctors ao clicar em Cancelar", () => {
    render(<DeleteDoctorPage />);
    fireEvent.click(screen.getByText(/cancelar/i));
    expect(pushMock).toHaveBeenCalledWith("/doctors");
  });
});
