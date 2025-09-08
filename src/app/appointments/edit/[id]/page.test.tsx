// src/app/appointments/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EditAppointmentPage from "./page";
import { useRouter, useParams } from "next/navigation";
import { appointmentsMock } from "../../../mocks/appointments";
import { AppointmentStatus } from "../../../types/Appointment";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

describe("EditAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();

    // Reset do mock
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
    expect(screen.getByDisplayValue("2")).toBeInTheDocument(); // Confirmed = 2
    expect(screen.getByDisplayValue("Observação inicial")).toBeInTheDocument();
  });

  it("atualiza os campos ao alterar inputs", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<EditAppointmentPage />);

    const patientSelect = screen.getByLabelText("Paciente") as HTMLSelectElement;
    const doctorSelect = screen.getByLabelText("Médico") as HTMLSelectElement;
    const dateInput = screen.getByLabelText("Data da Consulta") as HTMLInputElement;
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

    fireEvent.change(screen.getByLabelText("Paciente"), { target: { value: "11" } });
    fireEvent.change(screen.getByLabelText("Médico"), { target: { value: "21" } });
    fireEvent.change(screen.getByLabelText("Data da Consulta"), { target: { value: "2025-08-23T14:00" } });
    fireEvent.change(screen.getByLabelText("Observações"), { target: { value: "Nova observação" } });

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

  it("exibe fallback de ID se paciente ou médico não existirem nos mocks", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    appointmentsMock[0].patientName = "";
    appointmentsMock[0].doctorName = "";

    render(<EditAppointmentPage />);

    // Seleção não deve quebrar, mas se o nome não existe, fallback será usado na lógica futura
    expect(screen.getByDisplayValue(appointmentsMock[0].patientId.toString())).toBeInTheDocument();
    expect(screen.getByDisplayValue(appointmentsMock[0].doctorId.toString())).toBeInTheDocument();
  });
});
