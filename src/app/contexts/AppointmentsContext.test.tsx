// src/contexts/AppointmentsContext.test.tsx

import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { AppointmentsContext, AppointmentsContextType } from "./AppointmentsContext";
import { AppointmentStatus } from "../types/Appointment";

const TestComponent = () => {
  const context = useContext<AppointmentsContextType>(AppointmentsContext);

  return (
    <div>
      <span data-testid="appointments-count">{context.appointments.length}</span>
      <button
        onClick={() =>
          context.addAppointment({
            patientId: 1,
            doctorId: 1,
            patientName: "John",
            appointmentDate: "2025-08-21",
            status: AppointmentStatus.Scheduled,
          })
        }
      >
        Add
      </button>
      {context.appointments[0] && (
        <>
          <button
            onClick={() =>
              context.updateAppointment({
                ...context.appointments[0],
                patientName: "John Updated",
              })
            }
          >
            Update
          </button>
          <button onClick={() => context.deleteAppointment(context.appointments[0].id)}>Delete</button>
          <button onClick={() => context.confirmAppointment(context.appointments[0].id)}>Confirm</button>
          <button onClick={() => context.cancelAppointment(context.appointments[0].id)}>Cancel</button>
        </>
      )}
    </div>
  );
};

describe("AppointmentsContext", () => {
  it("provides default values", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("appointments-count").textContent).toBe("0");

    expect(() => screen.getByText("Add").click()).not.toThrow();
  });
});
