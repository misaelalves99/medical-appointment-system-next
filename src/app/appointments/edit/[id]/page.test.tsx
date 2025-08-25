// src/app/appointments/edit/[id]/page.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import EditAppointmentPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { appointmentsMock } from "../../../mocks/appointments";
import { AppointmentStatus } from "../../../types/Appointment";

// Mock do useRouter e useParams
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("EditAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
    appointmentsMock.length = 0;
    appointmentsMock.push({
      id: 1,
      patientId: 10,
      patientName: "Paciente Teste",
      doctorId: 20,
      doctorName: "Doutor Teste",
      appointmentDate: "2025-08-22T10:00",
      status: AppointmentStatus.Confirmed,
      notes: "Observação inicial",
    });
  });

  it("renderiza o formulário com dados preenchidos", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<EditAppointmentPage />);

    expect(screen.getByText("Editar Consulta")).toBeInTheDocument();
    expect((screen.getByDisplayValue("10") as HTMLOptionElement).value).toBe("10");
    expect((screen.getByDisplayValue("20") as HTMLOptionElement).value).toBe("20");
    expect(screen.getByDisplayValue("2025-08-22T10:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue(AppointmentStatus.Confirmed)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Observação inicial")).toBeInTheDocument();
  });

  it("atualiza os campos ao alterar inputs", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<EditAppointmentPage />);

    const patientSelect = screen.getByLabelText("Paciente") as HTMLSelectElement;
    const doctorSelect = screen.getByLabelText("Médico") as HTMLSelectElement;
    const dateInput = screen.getByLabelText("Data e Hora") as HTMLInputElement;
    const notesInput = screen.getByLabelText("Observações") as HTMLTextAreaElement;

    fireEvent.change(patientSelect, { target: { value: "11" } });
    fireEvent.change(doctorSelect, { target: { value: "21" } });
    fireEvent.change(dateInput, { target: { value: "2025-08-23T14:00" } });
    fireEvent.change(notesInput, { target: { value: "Nova observação" } });

    expect(patientSelect.value).toBe("11");
    expect(doctorSelect.value).toBe("21");
    expect(dateInput.value).toBe("2025-08-23T14:00");
    expect(notesInput.value).toBe("Nova observação");
  });

  it("atualiza o mock e navega ao submeter o formulário", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<EditAppointmentPage />);

    const patientSelect = screen.getByLabelText("Paciente") as HTMLSelectElement;
    const doctorSelect = screen.getByLabelText("Médico") as HTMLSelectElement;
    const dateInput = screen.getByLabelText("Data e Hora") as HTMLInputElement;
    const notesInput = screen.getByLabelText("Observações") as HTMLTextAreaElement;

    fireEvent.change(patientSelect, { target: { value: "11" } });
    fireEvent.change(doctorSelect, { target: { value: "21" } });
    fireEvent.change(dateInput, { target: { value: "2025-08-23T14:00" } });
    fireEvent.change(notesInput, { target: { value: "Nova observação" } });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    fireEvent.click(screen.getByText("Salvar"));

    const updated = appointmentsMock.find(a => a.id === 1);
    expect(updated).toBeDefined();
    expect(updated?.patientId).toBe(11);
    expect(updated?.doctorId).toBe(21);
    expect(updated?.appointmentDate).toBe("2025-08-23T14:00");
    expect(updated?.notes).toBe("Nova observação");

    expect(consoleSpy).toHaveBeenCalledWith("Consulta atualizada:", updated);
    expect(pushMock).toHaveBeenCalledWith("/appointments");

    consoleSpy.mockRestore();
  });

  it("navega ao clicar em Cancelar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<EditAppointmentPage />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });
});
