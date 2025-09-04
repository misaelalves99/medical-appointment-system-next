// src/app/appointments/calendar/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CalendarAppointmentsPage from "./page";
import * as nextNavigation from "next/navigation";
import * as appointmentsModule from "../../mocks/appointments";
import { Appointment, AppointmentStatus } from "../../types/Appointment";

type RouterType = ReturnType<typeof nextNavigation.useRouter>;

interface MockRouter extends Partial<RouterType> {
  push: jest.Mock;
  replace: jest.Mock;
  back: jest.Mock;
  forward: jest.Mock;
  refresh: jest.Mock;
  prefetch: jest.Mock;
  pathname: string;
  query: Record<string, unknown>;
  events: {
    on: jest.Mock;
    off: jest.Mock;
    emit: jest.Mock;
  };
  isFallback: boolean;
}

describe("CalendarAppointmentsPage", () => {
  const pushMock = jest.fn();

  const mockRouter: MockRouter = {
    push: pushMock,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    query: {},
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(nextNavigation, "useRouter")
      .mockReturnValue(mockRouter as unknown as RouterType);
  });

  it("renderiza o título da página", () => {
    render(<CalendarAppointmentsPage />);
    expect(
      screen.getByRole("heading", { name: /Calendário de Consultas/i })
    ).toBeInTheDocument();
  });

  it("renderiza todos os agendamentos do mock ordenados por data", () => {
    render(<CalendarAppointmentsPage />);

    const rows = screen.getAllByRole("row").slice(1); // ignorar header
    const sortedMock = [...appointmentsModule.appointmentsMock].sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );

    const statusMap: Record<AppointmentStatus, string> = {
      [AppointmentStatus.Scheduled]: "Agendada",
      [AppointmentStatus.Confirmed]: "Confirmada",
      [AppointmentStatus.Cancelled]: "Cancelada",
      [AppointmentStatus.Completed]: "Concluída",
    };

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      const appointment = sortedMock[index];
      const dt = new Date(appointment.appointmentDate);

      expect(cells[0].textContent).toBe(dt.toLocaleDateString("pt-BR"));
      expect(cells[1].textContent).toBe(
        dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
      expect(cells[2].textContent).toBe(
        appointment.patientName || `ID ${appointment.patientId}`
      );
      expect(cells[3].textContent).toBe(
        appointment.doctorName || `ID ${appointment.doctorId}`
      );

      const statusText =
        statusMap[appointment.status] || "Desconhecido";

      expect(cells[4].textContent).toBe(statusText);
    });
  });

  it("botão Voltar navega para /appointments", () => {
    render(<CalendarAppointmentsPage />);
    fireEvent.click(screen.getByText(/Voltar/i));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("mostra ID quando paciente ou médico não tem nome", () => {
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        patientId: 10,
        doctorId: 20,
        patientName: "",
        doctorName: "",
        appointmentDate: new Date().toISOString(),
        status: AppointmentStatus.Scheduled,
        notes: "",
      },
    ];

    jest
      .spyOn(appointmentsModule, "appointmentsMock", "get")
      .mockReturnValue(mockAppointments);

    render(<CalendarAppointmentsPage />);

    expect(screen.getByText("ID 10")).toBeInTheDocument();
    expect(screen.getByText("ID 20")).toBeInTheDocument();
  });

  it("mostra 'Desconhecido' para status não mapeado", () => {
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        patientId: 1,
        doctorId: 2,
        patientName: "Ana",
        doctorName: "Dr. José",
        appointmentDate: new Date().toISOString(),
        status: "Unknown" as unknown as AppointmentStatus,
        notes: "",
      },
    ];

    jest
      .spyOn(appointmentsModule, "appointmentsMock", "get")
      .mockReturnValue(mockAppointments);

    render(<CalendarAppointmentsPage />);
    expect(screen.getByText("Desconhecido")).toBeInTheDocument();
  });

  it("renderiza mensagem quando não há agendamentos", () => {
    jest
      .spyOn(appointmentsModule, "appointmentsMock", "get")
      .mockReturnValue([]);

    render(<CalendarAppointmentsPage />);
    expect(screen.getByText("Nenhuma consulta cadastrada.")).toBeInTheDocument();
  });
});
