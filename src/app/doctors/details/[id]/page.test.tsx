// src/app/doctors/details/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DoctorDetailsPage from "./page";
import { doctorsMock } from "../../../mocks/doctors";
import { useParams, useRouter } from "next/navigation";

// Mock do Next.js router e params
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("DoctorDetailsPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("deve exibir mensagem de carregando quando o médico não for encontrado", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" }); // id inexistente
    render(<DoctorDetailsPage />);
    expect(
      screen.getByText(/Carregando ou médico não encontrado/i)
    ).toBeInTheDocument();
  });

  it("deve renderizar os detalhes do médico quando encontrado", () => {
    const doctor = doctorsMock[0];
    (useParams as jest.Mock).mockReturnValue({ id: String(doctor.id) });

    render(<DoctorDetailsPage />);

    expect(screen.getByText("Detalhes do Médico")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(doctor.name, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(doctor.crm, "i"))).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(doctor.specialty, "i"))
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(doctor.email, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(doctor.phone, "i"))).toBeInTheDocument();
  });

  it("deve navegar para a edição ao clicar em Editar", () => {
    const doctor = doctorsMock[0];
    (useParams as jest.Mock).mockReturnValue({ id: String(doctor.id) });

    render(<DoctorDetailsPage />);
    fireEvent.click(screen.getByRole("button", { name: /editar/i }));

    expect(mockPush).toHaveBeenCalledWith(`/doctors/edit/${doctor.id}`);
  });

  it("deve navegar de volta à lista ao clicar em Voltar", () => {
    const doctor = doctorsMock[0];
    (useParams as jest.Mock).mockReturnValue({ id: String(doctor.id) });

    render(<DoctorDetailsPage />);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(mockPush).toHaveBeenCalledWith("/doctors");
  });
});
