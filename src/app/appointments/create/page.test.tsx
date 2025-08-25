// src/app/appointments/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreateAppointmentPage from "./page";
import { useRouter } from "next/navigation";
import { patientsMock } from "../../mocks/patients";
import { doctorsMock } from "../../mocks/doctors";
import { appointmentsMock } from "../../mocks/appointments";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CreateAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
    // Limpar mock de appointments antes de cada teste
    appointmentsMock.length = 0;
  });

  it("renderiza o formulário com campos e opções", () => {
    render(<CreateAppointmentPage />);

    expect(screen.getByText("Nova Consulta")).toBeInTheDocument();
    expect(screen.getByLabelText("Paciente")).toBeInTheDocument();
    expect(screen.getByLabelText("Médico")).toBeInTheDocument();
    expect(screen.getByLabelText("Data da Consulta")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Observações")).toBeInTheDocument();

    // Verificar opções de pacientes e médicos
    patientsMock.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
    doctorsMock.forEach((d) => {
      expect(screen.getByText(d.name)).toBeInTheDocument();
    });
  });

  it("atualiza o state ao mudar inputs", () => {
    render(<CreateAppointmentPage />);

    const patientSelect = screen.getByLabelText("Paciente") as HTMLSelectElement;
    const doctorSelect = screen.getByLabelText("Médico") as HTMLSelectElement;
    const dateInput = screen.getByLabelText("Data da Consulta") as HTMLInputElement;
    const notesInput = screen.getByLabelText("Observações") as HTMLTextAreaElement;

    fireEvent.change(patientSelect, { target: { value: patientsMock[0].id.toString() } });
    fireEvent.change(doctorSelect, { target: { value: doctorsMock[0].id.toString() } });
    fireEvent.change(dateInput, { target: { value: "2025-08-22T10:00" } });
    fireEvent.change(notesInput, { target: { value: "Observação teste" } });

    expect(patientSelect.value).toBe(patientsMock[0].id.toString());
    expect(doctorSelect.value).toBe(doctorsMock[0].id.toString());
    expect(dateInput.value).toBe("2025-08-22T10:00");
    expect(notesInput.value).toBe("Observação teste");
  });

  it("cria nova consulta e navega ao submeter o formulário", () => {
    render(<CreateAppointmentPage />);
    const patientSelect = screen.getByLabelText("Paciente") as HTMLSelectElement;
    const doctorSelect = screen.getByLabelText("Médico") as HTMLSelectElement;
    const dateInput = screen.getByLabelText("Data da Consulta") as HTMLInputElement;

    fireEvent.change(patientSelect, { target: { value: patientsMock[0].id.toString() } });
    fireEvent.change(doctorSelect, { target: { value: doctorsMock[0].id.toString() } });
    fireEvent.change(dateInput, { target: { value: "2025-08-22T10:00" } });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    fireEvent.click(screen.getByText("Salvar"));

    // Verifica se adicionou ao mock
    expect(appointmentsMock.length).toBe(1);
    expect(appointmentsMock[0].patientId).toBe(patientsMock[0].id);
    expect(appointmentsMock[0].doctorId).toBe(doctorsMock[0].id);
    expect(appointmentsMock[0].appointmentDate).toBe("2025-08-22T10:00");

    expect(consoleSpy).toHaveBeenCalledWith("Nova consulta criada:", appointmentsMock[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments");

    consoleSpy.mockRestore();
  });

  it("navega ao clicar em Cancelar", () => {
    render(<CreateAppointmentPage />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });
});
