// src/app/appointments/components/DeleteAppointment.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import DeleteAppointment from "./DeleteAppointment";
import { Appointment, AppointmentStatus } from "../types/Appointment";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("DeleteAppointment", () => {
  const pushMock = jest.fn();
  const onDeleteMock = jest.fn();

  const appointment: Appointment = {
    id: 1,
    patientId: 10,
    patientName: "Paciente 1",
    doctorId: 20,
    doctorName: "Doutor 1",
    appointmentDate: "2025-08-22T10:00",
    status: AppointmentStatus.Scheduled,
    notes: "Nota inicial",
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it("renderiza corretamente os dados da consulta", () => {
    render(<DeleteAppointment appointment={appointment} onDelete={onDeleteMock} />);

    expect(screen.getByText("Excluir Consulta")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza que deseja excluir esta consulta?")).toBeInTheDocument();
    
    // Paciente e Médico
    expect(screen.getByText("Paciente")).toBeInTheDocument();
    expect(screen.getByText("Paciente 1")).toBeInTheDocument();
    expect(screen.getByText("Médico")).toBeInTheDocument();
    expect(screen.getByText("Doutor 1")).toBeInTheDocument();

    // Data e hora
    const formattedDate = new Date(appointment.appointmentDate).toLocaleString("pt-BR");
    expect(screen.getByText("Data e Hora")).toBeInTheDocument();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();

    // Status
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Agendada")).toBeInTheDocument();
  });

  it("chama onDelete e navega ao clicar em Excluir", () => {
    render(<DeleteAppointment appointment={appointment} onDelete={onDeleteMock} />);
    
    const deleteBtn = screen.getByText("Excluir");
    fireEvent.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(1);
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("navega ao clicar em Cancelar sem chamar onDelete", () => {
    render(<DeleteAppointment appointment={appointment} onDelete={onDeleteMock} />);
    
    const cancelBtn = screen.getByText("Cancelar");
    fireEvent.click(cancelBtn);

    expect(onDeleteMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("renderiza IDs quando paciente ou médico não possuem nome", () => {
    const anonAppointment: Appointment = {
      ...appointment,
      patientName: "",
      doctorName: "",
    };

    render(<DeleteAppointment appointment={anonAppointment} onDelete={onDeleteMock} />);
    expect(screen.getByText(`ID ${anonAppointment.patientId}`)).toBeInTheDocument();
    expect(screen.getByText(`ID ${anonAppointment.doctorId}`)).toBeInTheDocument();
  });
});
