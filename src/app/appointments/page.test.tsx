import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentList from "./page";
import { useRouter } from "next/navigation";
import { appointmentsMock } from "../mocks/appointments";
import { AppointmentStatus } from "../types/Appointment";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AppointmentList", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    // Reset mock e adicionar dois agendamentos
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

  it("renderiza a lista de consultas", () => {
    render(<AppointmentList />);
    expect(screen.getByText("Lista de Consultas")).toBeInTheDocument();
    expect(screen.getByText("Paciente 1")).toBeInTheDocument();
    expect(screen.getByText("Doutor 1")).toBeInTheDocument();
  });

  it("filtra a tabela pelo search input", () => {
    render(<AppointmentList />);
    const searchInput = screen.getByPlaceholderText(
      "Pesquisar por ID, data, hora, paciente ou status..."
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "Paciente 2" } });

    expect(screen.queryByText("Paciente 1")).not.toBeInTheDocument();
    expect(screen.getByText("Paciente 2")).toBeInTheDocument();
  });

  it("navega ao clicar em Nova Consulta", () => {
    render(<AppointmentList />);
    fireEvent.click(screen.getByText("Nova Consulta"));
    expect(pushMock).toHaveBeenCalledWith("/appointments/create");
  });

  it("navega ao clicar em Detalhes, Editar e Excluir", () => {
    render(<AppointmentList />);
    
    fireEvent.click(screen.getAllByText("Detalhes")[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments/details/1");

    fireEvent.click(screen.getAllByText("Editar")[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments/edit/1");

    fireEvent.click(screen.getAllByText("Excluir")[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments/delete/1");
  });
});
