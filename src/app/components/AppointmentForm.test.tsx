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
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    // Reset do mock
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

  it("renderiza no modo create com valores padrão", () => {
    render(<AppointmentForm mode="create" />);
    expect(screen.getByText("Nova Consulta")).toBeInTheDocument();
    expect(screen.getByLabelText("Paciente ID:")).toHaveValue(0);
    expect(screen.getByLabelText("Médico ID:")).toHaveValue(0);
    expect(screen.getByLabelText("Status:")).toHaveValue(AppointmentStatus.Scheduled);
  });

  it("renderiza no modo edit com dados preenchidos e mostra loading", async () => {
    render(<AppointmentForm mode="edit" />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();

    await waitFor(() => screen.getByLabelText("Paciente ID:"));

    expect(screen.getByLabelText("Paciente ID:")).toHaveValue(10);
    expect(screen.getByLabelText("Médico ID:")).toHaveValue(20);
    expect(screen.getByLabelText("Notas:")).toHaveValue("Nota inicial");
    expect(screen.getByLabelText("Status:")).toHaveValue(AppointmentStatus.Scheduled);
  });

  it("valida campos obrigatórios individualmente", () => {
    render(<AppointmentForm mode="create" />);

    const submitBtn = screen.getByText("Criar");

    // Sem preencher nada
    fireEvent.click(submitBtn);
    expect(appointmentsMock.length).toBe(1);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("cria nova consulta com sucesso", () => {
    render(<AppointmentForm mode="create" />);

    fireEvent.change(screen.getByLabelText("Paciente ID:"), { target: { value: "11" } });
    fireEvent.change(screen.getByLabelText("Médico ID:"), { target: { value: "21" } });
    fireEvent.change(screen.getByLabelText("Notas:"), { target: { value: "Nova nota" } });
    fireEvent.change(screen.getByLabelText("Status:"), { target: { value: AppointmentStatus.Confirmed.toString() } });

    fireEvent.click(screen.getByText("Criar"));

    const newAppointment = appointmentsMock.find(a => a.id === 2);
    expect(newAppointment).toBeDefined();
    expect(newAppointment?.patientId).toBe(11);
    expect(newAppointment?.doctorId).toBe(21);
    expect(newAppointment?.status).toBe(AppointmentStatus.Confirmed);
    expect(newAppointment?.notes).toBe("Nova nota");
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

  it("altera status corretamente", async () => {
    render(<AppointmentForm mode="edit" />);
    await waitFor(() => screen.getByLabelText("Status:"));

    fireEvent.change(screen.getByLabelText("Status:"), { target: { value: AppointmentStatus.Confirmed.toString() } });
    fireEvent.click(screen.getByText("Salvar"));

    const updated = appointmentsMock.find(a => a.id === 1);
    expect(updated?.status).toBe(AppointmentStatus.Confirmed);
  });

  it("altera data corretamente", async () => {
    render(<AppointmentForm mode="edit" />);
    await waitFor(() => screen.getByLabelText("Data e Hora:"));

    fireEvent.change(screen.getByLabelText("Data e Hora:"), { target: { value: "2025-08-23T15:30" } });
    fireEvent.click(screen.getByText("Salvar"));

    const updated = appointmentsMock.find(a => a.id === 1);
    expect(new Date(updated!.appointmentDate).toISOString()).toBe(new Date("2025-08-23T15:30").toISOString());
  });

  it("mantém notas vazias sem quebrar", () => {
    render(<AppointmentForm mode="create" />);
    fireEvent.change(screen.getByLabelText("Paciente ID:"), { target: { value: "11" } });
    fireEvent.change(screen.getByLabelText("Médico ID:"), { target: { value: "21" } });
    fireEvent.change(screen.getByLabelText("Notas:"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Criar"));

    const newAppointment = appointmentsMock.find(a => a.id === 2);
    expect(newAppointment?.notes).toBe("");
  });

  it("converte datas corretamente para datetime-local e ISO", async () => {
    render(<AppointmentForm mode="edit" />);
    await waitFor(() => screen.getByLabelText("Data e Hora:"));

    const input = screen.getByLabelText("Data e Hora:") as HTMLInputElement;
    const isoBefore = appointmentsMock[0].appointmentDate;
    expect(new Date(input.value).toISOString()).toBe(new Date(isoBefore).toISOString());

    fireEvent.change(input, { target: { value: "2025-08-25T18:45" } });
    fireEvent.click(screen.getByText("Salvar"));

    expect(new Date(appointmentsMock[0].appointmentDate).toISOString()).toBe(new Date("2025-08-25T18:45").toISOString());
  });
});
