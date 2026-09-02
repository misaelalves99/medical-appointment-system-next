// src/app/components/AppointmentForm.test.tsx

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AppointmentForm from "./AppointmentForm";
import { AppointmentStatus } from "../types/Appointment";
import type { Appointment } from "../types/Appointment";
import { useRouter, useParams } from "next/navigation";
import { useAppointments } from "../hooks/useAppointments";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("../hooks/useAppointments", () => ({
  useAppointments: jest.fn(),
}));

const pushMock = jest.fn();
const addAppointmentMock = jest.fn();
const updateAppointmentMock = jest.fn();

const existingAppointment: Appointment = {
  id: 1,
  patientId: 10,
  patientName: "Paciente Teste",
  doctorId: 20,
  doctorName: "Médico Teste",
  appointmentDate: "2025-08-22T13:00:00.000Z",
  status: AppointmentStatus.Scheduled,
  notes: "Nota inicial",
};

const mockUseAppointments = useAppointments as jest.MockedFunction<typeof useAppointments>;
const mockUseRouter = useRouter as jest.Mock;
const mockUseParams = useParams as jest.Mock;

describe("AppointmentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: pushMock,
    });

    mockUseParams.mockReturnValue({
      id: "1",
    });

    mockUseAppointments.mockReturnValue({
      appointments: [{ ...existingAppointment }],
      addAppointment: addAppointmentMock,
      updateAppointment: updateAppointmentMock,
      deleteAppointment: jest.fn(),
      confirmAppointment: jest.fn(),
      cancelAppointment: jest.fn(),
    });
  });

  it("renderiza no modo create com valores padrão", () => {
    render(<AppointmentForm mode="create" />);

    expect(screen.getByText("Nova Consulta")).toBeInTheDocument();
    expect(screen.getByLabelText("Paciente ID:")).toHaveValue(0);
    expect(screen.getByLabelText("Médico ID:")).toHaveValue(0);
    expect(screen.getByLabelText("Status:")).toHaveValue(
      AppointmentStatus.Scheduled.toString()
    );
  });

  it("renderiza no modo edit com dados do boundary de appointments", async () => {
    render(<AppointmentForm mode="edit" />);

    await waitFor(() => {
      expect(screen.getByLabelText("Paciente ID:")).toHaveValue(10);
    });

    expect(screen.getByLabelText("Médico ID:")).toHaveValue(20);
    expect(screen.getByLabelText("Notas:")).toHaveValue("Nota inicial");
    expect(screen.getByLabelText("Status:")).toHaveValue(
      AppointmentStatus.Scheduled.toString()
    );
  });

  it("valida campos obrigatórios individualmente", () => {
    render(<AppointmentForm mode="create" />);

    fireEvent.click(screen.getByText("Criar"));

    expect(addAppointmentMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("cria nova consulta através do boundary", () => {
    render(<AppointmentForm mode="create" />);

    fireEvent.change(screen.getByLabelText("Paciente ID:"), {
      target: { value: "11" },
    });

    fireEvent.change(screen.getByLabelText("Médico ID:"), {
      target: { value: "21" },
    });

    fireEvent.change(screen.getByLabelText("Status:"), {
      target: { value: AppointmentStatus.Confirmed.toString() },
    });

    fireEvent.change(screen.getByLabelText("Notas:"), {
      target: { value: "Nova consulta" },
    });

    fireEvent.click(screen.getByText("Criar"));

    expect(addAppointmentMock).toHaveBeenCalledTimes(1);
    expect(addAppointmentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: 11,
        doctorId: 21,
        status: AppointmentStatus.Confirmed,
        notes: "Nova consulta",
      })
    );

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("edita consulta existente através do boundary", async () => {
    render(<AppointmentForm mode="edit" />);

    await waitFor(() => {
      expect(screen.getByLabelText("Notas:")).toHaveValue("Nota inicial");
    });

    fireEvent.change(screen.getByLabelText("Notas:"), {
      target: { value: "Atualizado" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(updateAppointmentMock).toHaveBeenCalledTimes(1);
    expect(updateAppointmentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        patientId: 10,
        doctorId: 20,
        notes: "Atualizado",
      })
    );

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("altera status corretamente", async () => {
    render(<AppointmentForm mode="edit" />);

    await waitFor(() => {
      expect(screen.getByLabelText("Paciente ID:")).toHaveValue(10);
    });

    fireEvent.change(screen.getByLabelText("Status:"), {
      target: { value: AppointmentStatus.Confirmed.toString() },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(updateAppointmentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        status: AppointmentStatus.Confirmed,
      })
    );
  });

  it("altera data corretamente", async () => {
    render(<AppointmentForm mode="edit" />);

    await waitFor(() => {
      expect(screen.getByLabelText("Paciente ID:")).toHaveValue(10);
    });

    fireEvent.change(screen.getByLabelText("Data e Hora:"), {
      target: { value: "2025-08-23T15:30" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(updateAppointmentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        appointmentDate: new Date("2025-08-23T15:30").toISOString(),
      })
    );
  });

  it("mantém notas vazias sem quebrar", () => {
    render(<AppointmentForm mode="create" />);

    fireEvent.change(screen.getByLabelText("Paciente ID:"), {
      target: { value: "11" },
    });

    fireEvent.change(screen.getByLabelText("Médico ID:"), {
      target: { value: "21" },
    });

    fireEvent.change(screen.getByLabelText("Notas:"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Criar"));

    expect(addAppointmentMock).toHaveBeenCalledTimes(1);
    expect(addAppointmentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: 11,
        doctorId: 21,
        notes: "",
      })
    );
  });

  it("converte datas corretamente para datetime-local e ISO", async () => {
    render(<AppointmentForm mode="edit" />);

    await waitFor(() => {
      expect(screen.getByLabelText("Paciente ID:")).toHaveValue(10);
    });

    const input = screen.getByLabelText("Data e Hora:") as HTMLInputElement;

    expect(new Date(input.value).toISOString()).toBe(
      new Date(existingAppointment.appointmentDate).toISOString()
    );

    fireEvent.change(input, {
      target: { value: "2025-08-25T18:45" },
    });

    fireEvent.click(screen.getByText("Salvar"));

    expect(updateAppointmentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        appointmentDate: new Date("2025-08-25T18:45").toISOString(),
      })
    );
  });
});