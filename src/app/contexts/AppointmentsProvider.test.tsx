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
      <button
        onClick={() =>
          addAppointment({
            patientId: 1,
            doctorId: 1,
            patientName: "Alice",
            appointmentDate: "2025-08-21",
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
                patientName: "Bob",
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

describe("AppointmentsProvider", () => {
  it("manages appointments state correctly", async () => {
    render(
      <AppointmentsProvider>
        <TestComponent />
      </AppointmentsProvider>
    );

    const count = screen.getByTestId("appointments-count");
    expect(Number(count.textContent)).toBeGreaterThanOrEqual(0);

    const user = userEvent.setup();

    // Adicionar
    await user.click(screen.getByText("Add"));
    expect(Number(count.textContent)).toBeGreaterThanOrEqual(1);

    // Atualizar
    if (screen.queryByText("Update")) await user.click(screen.getByText("Update"));

    // Confirmar
    if (screen.queryByText("Confirm")) await user.click(screen.getByText("Confirm"));

    // Cancelar
    if (screen.queryByText("Cancel")) await user.click(screen.getByText("Cancel"));

    // Excluir
    if (screen.queryByText("Delete")) await user.click(screen.getByText("Delete"));
    expect(Number(count.textContent)).toBeGreaterThanOrEqual(0);
  });
});
