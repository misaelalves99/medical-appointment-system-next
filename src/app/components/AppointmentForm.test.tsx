// src/app/appointments/components/AppointmentForm.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppointmentForm from "./AppointmentForm";
import { appointmentsMock } from "../mocks/appointments";
import { AppointmentStatus } from "../types/Appointment";
import { useRouter, useParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("AppointmentForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    jest.clearAllMocks();

    // Resetar mock
    appointmentsMock.length = 0;
    appointmentsMock.push({
      id: 1,
      patientId: 10,
      patientName: "Paciente 1",
      doctorId: 20,
      doctorName: "Doutor 1",
      appointmentDate: "2025-08-22T10:00",
      status: AppointmentStatus.Scheduled,
      notes: "Nota inicial",
    });
  });

  it("renderiza no modo create", () => {
    render(<AppointmentForm mode="create" />);
    expect(screen.getByText("Nova Consulta")).toBeInTheDocument();
    expect(screen.getByLabelText("Paciente ID:")).toHaveValue(0);
    expect(screen.getByLabelText("Médico ID:")).toHaveValue(0);
  });

  it("renderiza no modo edit com dados preenchidos", async () => {
    render(<AppointmentForm mode="edit" />);
    await waitFor(() => screen.getByLabelText("Paciente ID:"));
    expect(screen.getByLabelText("Paciente ID:")).toHaveValue(10);
    expect(screen.getByLabelText("Médico ID:")).toHaveValue(20);
    expect(screen.getByLabelText("Notas:")).toHaveValue("Nota inicial");
  });

  it("valida campos obrigatórios", () => {
    render(<AppointmentForm mode="create" />);
    const submitBtn = screen.getByText("Criar");
    fireEvent.click(submitBtn);

    // Não deve adicionar no mock e não navega
    expect(appointmentsMock.length).toBe(1); // nenhum novo
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("cria nova consulta com sucesso", () => {
    render(<AppointmentForm mode="create" />);

    fireEvent.change(screen.getByLabelText("Paciente ID:"), { target: { value: "11" } });
    fireEvent.change(screen.getByLabelText("Médico ID:"), { target: { value: "21" } });

    const submitBtn = screen.getByText("Criar");
    fireEvent.click(submitBtn);

    const newAppointment = appointmentsMock.find(a => a.id === 2);
    expect(newAppointment).toBeDefined();
    expect(newAppointment?.patientId).toBe(11);
    expect(newAppointment?.doctorId).toBe(21);
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("edita consulta existente com sucesso", async () => {
    render(<AppointmentForm mode="edit" />);
    await waitFor(() => screen.getByLabelText("Paciente ID:"));

    fireEvent.change(screen.getByLabelText("Notas:"), { target: { value: "Atualizado" } });
    fireEvent.click(screen.getByText("Salvar"));

    const updated = appointmentsMock.find(a => a.id === 1);
    expect(updated?.notes).toBe("Atualizado");
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });
});
