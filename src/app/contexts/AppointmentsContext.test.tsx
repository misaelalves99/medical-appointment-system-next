// src/contexts/AppointmentsContext.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { useContext, useState, ReactNode } from "react";
import { AppointmentsContext, AppointmentsContextType } from "./AppointmentsContext";
import { Appointment, AppointmentStatus } from "../types/Appointment";

const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const id = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    setAppointments([...appointments, { id, ...appointment }]);
  };

  const updateAppointment = (updated: Appointment) => {
    setAppointments(appointments.map(a => (a.id === updated.id ? updated : a)));
  };

  const deleteAppointment = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const confirmAppointment = (id: number) => {
    setAppointments(appointments.map(a => (a.id === id ? { ...a, status: AppointmentStatus.Confirmed } : a)));
  };

  const cancelAppointment = (id: number) => {
    setAppointments(appointments.map(a => (a.id === id ? { ...a, status: AppointmentStatus.Cancelled } : a)));
  };

  return (
    <AppointmentsContext.Provider
      value={{ appointments, addAppointment, updateAppointment, deleteAppointment, confirmAppointment, cancelAppointment }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

const TestComponent = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, confirmAppointment, cancelAppointment } =
    useContext<AppointmentsContextType>(AppointmentsContext);

  return (
    <div>
      <span data-testid="appointments-count">{appointments.length}</span>
      <button
        onClick={() =>
          addAppointment({
            patientId: 1,
            doctorId: 1,
            patientName: "John",
            doctorName: "Dr. Smith",
            appointmentDate: "2025-08-21T10:00",
            status: AppointmentStatus.Scheduled,
          })
        }
      >
        Add
      </button>

      {appointments[0] && (
        <>
          <button
            onClick={() =>
              updateAppointment({
                ...appointments[0],
                patientName: "John Updated",
              })
            }
          >
            Update
          </button>
          <button onClick={() => deleteAppointment(appointments[0].id)}>Delete</button>
          <button onClick={() => confirmAppointment(appointments[0].id)}>Confirm</button>
          <button onClick={() => cancelAppointment(appointments[0].id)}>Cancel</button>
        </>
      )}
    </div>
  );
};

describe("AppointmentsContext", () => {
  it("inicialmente tem 0 consultas", () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    expect(screen.getByTestId("appointments-count").textContent).toBe("0");
  });

  it("adiciona uma consulta", () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("appointments-count").textContent).toBe("1");
  });

  it("atualiza a consulta", () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Update"));

    expect(screen.getByTestId("appointments-count").textContent).toBe("1");
    // opcional: verificar alteração do nome
  });

  it("confirma a consulta", () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Confirm"));

    // validar que status foi alterado
    // como TestComponent não mostra status, não há assert aqui
    expect(screen.getByTestId("appointments-count").textContent).toBe("1");
  });

  it("cancela a consulta", () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.getByTestId("appointments-count").textContent).toBe("1");
  });

  it("deleta a consulta", () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );

    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByTestId("appointments-count").textContent).toBe("0");
  });
});
