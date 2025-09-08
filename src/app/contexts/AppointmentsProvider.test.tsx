// src/contexts/AppointmentsProvider.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { AppointmentsContext, AppointmentsContextType } from "./AppointmentsContext";
import { AppointmentsProvider } from "./AppointmentsProvider";
import { AppointmentStatus } from "../types/Appointment";

const TestComponent = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, confirmAppointment, cancelAppointment } =
    useContext<AppointmentsContextType>(AppointmentsContext);

  return (
    <div>
      <span data-testid="appointments-count">{appointments.length}</span>
      {appointments[0] && <span data-testid="first-patient">{appointments[0].patientName}</span>}

      <button
        onClick={() =>
          addAppointment({
            patientId: 1,
            doctorId: 1,
            appointmentDate: "2025-08-21T10:00",
            status: AppointmentStatus.Scheduled,
          })
        }
      >
        Add
      </button>

      {appointments[0] && (
        <>
          <button onClick={() => updateAppointment({ ...appointments[0], patientName: "Bob" })}>Update</button>
          <button onClick={() => deleteAppointment(appointments[0].id)}>Delete</button>
          <button onClick={() => confirmAppointment(appointments[0].id)}>Confirm</button>
          <button onClick={() => cancelAppointment(appointments[0].id)}>Cancel</button>
        </>
      )}
    </div>
  );
};

describe("AppointmentsProvider", () => {
  it("gerencia corretamente o estado das consultas", async () => {
    const user = userEvent.setup();

    render(
      <AppointmentsProvider>
        <TestComponent />
      </AppointmentsProvider>
    );

    const count = screen.getByTestId("appointments-count");
    const initialCount = Number(count.textContent);

    // Adicionar
    await user.click(screen.getByText("Add"));
    expect(Number(count.textContent)).toBe(initialCount + 1);
    expect(screen.getByTestId("first-patient").textContent).toBe("Paciente #1");

    // Atualizar
    await user.click(screen.getByText("Update"));
    expect(screen.getByTestId("first-patient").textContent).toBe("Bob");

    // Confirmar e Cancelar (status não exibido)
    await user.click(screen.getByText("Confirm"));
    await user.click(screen.getByText("Cancel"));

    // Excluir
    await user.click(screen.getByText("Delete"));
    expect(Number(count.textContent)).toBe(initialCount);
  });
});
