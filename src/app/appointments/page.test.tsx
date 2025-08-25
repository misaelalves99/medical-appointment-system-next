// src/app/appointments/page.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppointmentList from "./page";
import * as nextNavigation from "next/navigation";
import { appointmentsMock } from "../mocks/appointments";
import { AppointmentStatus } from "../types/Appointment";

// Mock do useRouter corretamente
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AppointmentList", () => {
  const pushMock = jest.fn();
  const confirmSpy = jest.spyOn(window, "confirm");

  beforeEach(() => {
    jest.clearAllMocks();
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // reset do mock global de appointments
    appointmentsMock.length = 0;
    appointmentsMock.push(
      {
        id: 1,
        patientId: 10,
        patientName: "Paciente 1",
        doctorId: 20,
        doctorName: "Doutor 1",
        appointmentDate: "2025-08-22T10:00",
        status: AppointmentStatus.Scheduled,
        notes: "",
      },
      {
        id: 2,
        patientId: 11,
        patientName: "Paciente 2",
        doctorId: 21,
        doctorName: "Doutor 2",
        appointmentDate: "2025-08-23T14:00",
        status: AppointmentStatus.Confirmed,
        notes: "",
      }
    );
  });

  it("exibe loading inicialmente e depois a tabela", async () => {
    render(<AppointmentList />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Lista de Consultas")).toBeInTheDocument();
    });

    expect(screen.getByText("Paciente ID: 10")).toBeInTheDocument();
    expect(screen.getByText("Médico ID: 20")).toBeInTheDocument();
  });

  it("filtra a tabela pelo search input", async () => {
    render(<AppointmentList />);
    await waitFor(() => screen.getByText("Lista de Consultas"));

    const searchInput = screen.getByPlaceholderText(
      "Pesquisar por data, hora, paciente, médico ou status..."
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "Paciente 2" } });

    expect(screen.queryByText("Paciente ID: 10")).not.toBeInTheDocument();
    expect(screen.getByText("Paciente ID: 11")).toBeInTheDocument();
  });

  it("navega ao clicar em Nova Consulta", async () => {
    render(<AppointmentList />);
    await waitFor(() => screen.getByText("Lista de Consultas"));

    fireEvent.click(screen.getByText("Nova Consulta"));
    expect(pushMock).toHaveBeenCalledWith("/appointments/create");
  });

  it("exclui uma consulta ao confirmar", async () => {
    render(<AppointmentList />);
    await waitFor(() => screen.getByText("Lista de Consultas"));

    confirmSpy.mockReturnValueOnce(true); // simula confirmação

    fireEvent.click(screen.getAllByText("Excluir")[0]);

    expect(appointmentsMock.find((a) => a.id === 1)).toBeUndefined();
    expect(screen.queryByText("Paciente ID: 10")).not.toBeInTheDocument();
  });

  it("não exclui se cancelar no confirm", async () => {
    render(<AppointmentList />);
    await waitFor(() => screen.getByText("Lista de Consultas"));

    confirmSpy.mockReturnValueOnce(false); // simula cancelamento

    fireEvent.click(screen.getAllByText("Excluir")[0]);

    expect(appointmentsMock.find((a) => a.id === 1)).toBeDefined();
    expect(screen.getByText("Paciente ID: 10")).toBeInTheDocument();
  });

  it("renderiza links de detalhes e edição corretamente", async () => {
    render(<AppointmentList />);
    await waitFor(() => screen.getByText("Lista de Consultas"));

    expect(screen.getAllByText("Detalhes")[0].closest("a")).toHaveAttribute(
      "href",
      "/appointments/details/1"
    );
    expect(screen.getAllByText("Editar")[0].closest("a")).toHaveAttribute(
      "href",
      "/appointments/edit/1"
    );
  });
});
