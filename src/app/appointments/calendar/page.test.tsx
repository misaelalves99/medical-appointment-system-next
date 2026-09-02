import { fireEvent, render, screen } from "@testing-library/react";
import CalendarAppointmentsPage from "./page";
import * as nextNavigation from "next/navigation";
import { Appointment, AppointmentStatus } from "../../types/Appointment";
import { useAppointments } from "../../hooks/useAppointments";

jest.mock("../../hooks/useAppointments", () => ({
  useAppointments: jest.fn(),
}));

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

const mockUseAppointments = useAppointments as jest.MockedFunction<typeof useAppointments>;

const defaultAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    patientName: "João da Silva",
    doctorId: 2,
    doctorName: "Dra. Maria Oliveira",
    appointmentDate: "2025-08-15T14:30:00Z",
    status: AppointmentStatus.Confirmed,
    notes: "Paciente apresentou melhora significativa.",
  },
];

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

  const setAppointments = (appointments: Appointment[]) => {
    mockUseAppointments.mockReturnValue({
      appointments,
      addAppointment: jest.fn(),
      updateAppointment: jest.fn(),
      deleteAppointment: jest.fn(),
      confirmAppointment: jest.fn(),
      cancelAppointment: jest.fn(),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .spyOn(nextNavigation, "useRouter")
      .mockReturnValue(mockRouter as unknown as RouterType);

    setAppointments(defaultAppointments.map((appointment) => ({ ...appointment })));
  });

  it("renderiza o título da página", () => {
    render(<CalendarAppointmentsPage />);

    expect(
      screen.getByRole("heading", { name: /Calendário de Consultas/i })
    ).toBeInTheDocument();
  });

  it("renderiza todos os agendamentos do boundary ordenados por data", () => {
    const appointments: Appointment[] = [
      {
        id: 2,
        patientId: 2,
        patientName: "Paciente Dois",
        doctorId: 2,
        doctorName: "Médico Dois",
        appointmentDate: "2025-08-20T15:00:00Z",
        status: AppointmentStatus.Scheduled,
        notes: "",
      },
      {
        id: 1,
        patientId: 1,
        patientName: "Paciente Um",
        doctorId: 1,
        doctorName: "Médico Um",
        appointmentDate: "2025-08-10T10:00:00Z",
        status: AppointmentStatus.Confirmed,
        notes: "",
      },
    ];

    setAppointments(appointments);
    render(<CalendarAppointmentsPage />);

    const rows = screen.getAllByRole("row").slice(1);
    const sortedAppointments = [...appointments].sort(
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
      const appointment = sortedAppointments[index];
      const dt = new Date(appointment.appointmentDate);

      expect(cells[0].textContent).toBe(dt.toLocaleDateString("pt-BR"));
      expect(cells[1].textContent).toBe(
        dt.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      expect(cells[2].textContent).toBe(
        appointment.patientName || `ID ${appointment.patientId}`
      );
      expect(cells[3].textContent).toBe(
        appointment.doctorName || `ID ${appointment.doctorId}`
      );
      expect(cells[4].textContent).toBe(
        statusMap[appointment.status] || "Desconhecido"
      );
    });
  });

  it("botão Voltar navega para /appointments", () => {
    render(<CalendarAppointmentsPage />);

    fireEvent.click(screen.getByText(/Voltar/i));

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("mostra ID quando paciente ou médico não tem nome", () => {
    setAppointments([
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
    ]);

    render(<CalendarAppointmentsPage />);

    expect(screen.getByText("ID 10")).toBeInTheDocument();
    expect(screen.getByText("ID 20")).toBeInTheDocument();
  });

  it("mostra 'Desconhecido' para status não mapeado", () => {
    setAppointments([
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
    ]);

    render(<CalendarAppointmentsPage />);

    expect(screen.getByText("Desconhecido")).toBeInTheDocument();
  });

  it("renderiza apenas o cabeçalho quando não há agendamentos", () => {
    setAppointments([]);

    render(<CalendarAppointmentsPage />);

    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});