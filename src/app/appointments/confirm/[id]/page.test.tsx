import { fireEvent, render, screen } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import ConfirmAppointmentPage from "./page";
import { AppointmentStatus } from "../../../types/Appointment";

const pushMock = jest.fn();
const confirmAppointmentMock = jest.fn();

const appointment = {
  id: 1,
  patientId: 1,
  patientName: "Paciente de Teste",
  doctorId: 2,
  doctorName: "Profissional de Teste",
  appointmentDate: "2025-08-15T14:30:00Z",
  status: AppointmentStatus.Scheduled,
  notes: "",
};

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("../../../hooks/useAppointments", () => ({
  useAppointments: () => ({
    appointments: [appointment],
    confirmAppointment: confirmAppointmentMock,
  }),
}));

describe("ConfirmAppointmentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders the appointment selected by route identity", () => {
    render(<ConfirmAppointmentPage />);

    expect(screen.getByRole("heading", { name: "Confirmar Consulta" })).toBeInTheDocument();
    expect(screen.getByText(/Paciente:/).closest("li")?.textContent).toContain(appointment.patientName);
    expect(screen.getByText(/Médico:/).closest("li")?.textContent).toContain(appointment.doctorName);
  });

  it("confirms the selected appointment and returns to the list", () => {
    render(<ConfirmAppointmentPage />);

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(confirmAppointmentMock).toHaveBeenCalledWith(1);
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("renders not found when route identity does not resolve an appointment", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "999" });

    render(<ConfirmAppointmentPage />);

    expect(screen.getByText("Consulta não encontrada.")).toBeInTheDocument();
    expect(confirmAppointmentMock).not.toHaveBeenCalled();
  });
});
