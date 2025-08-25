// src/app/appointments/calendar/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CalendarAppointmentsPage from "./page";
import * as nextNavigation from "next/navigation";
import { appointmentsMock } from "../../mocks/appointments";

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

    const rows = screen.getAllByRole("row").slice(1); // pular header
    const sortedMock = [...appointmentsMock].sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      const appointment = sortedMock[index];

      expect(cells[0].textContent).toBe(
        new Date(appointment.appointmentDate).toLocaleDateString("pt-BR")
      );
      expect(cells[1].textContent).toBe(
        new Date(appointment.appointmentDate).toLocaleTimeString("pt-BR", {
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

      const statusMap: Record<string, string> = {
        Scheduled: "Agendada",
        Confirmed: "Confirmada",
        Cancelled: "Cancelada",
        Completed: "Concluída",
      };
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
});
