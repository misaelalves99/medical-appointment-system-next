// src/app/appointments/edit/[id]/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import EditAppointmentPage from "./page";
import { useRouter, useParams } from "next/navigation";

import { AppointmentStatus } from "../../../types/Appointment";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

const patientFixture = [
  {
    id: 11,
    name: "Paciente Teste",
    email: "paciente@teste.local",
    phone: "11999999999",
    birthDate: "1990-01-01",
    isActive: true,
  },
];

jest.mock("../../../hooks/usePatient", () => ({
  usePatient: () => ({
    patients: patientFixture,
  }),
}));
const doctorFixture = [
  {
    id: 21,
    name: "Medico Teste",
    crm: "CRM-21",
    specialty: "Cardiologia",
    email: "medico@teste.local",
    phone: "11988888888",
    isActive: true,
  },
];

jest.mock("../../../hooks/useDoctor", () => ({
  useDoctor: () => ({
    doctors: doctorFixture,
  }),
}));

const appointmentFixture = [
  {
    id: 1,
    patientId: 11,
    patientName: "Paciente Teste",
    doctorId: 21,
    doctorName: "Medico Teste",
    appointmentDate: "2025-08-22T10:00",
    status: AppointmentStatus.Confirmed,
    notes: "Observação inicial",
  },
];

const updateAppointmentMock = jest.fn();

jest.mock("../../../hooks/useAppointments", () => ({
  useAppointments: () => ({
    appointments: appointmentFixture,
    updateAppointment: updateAppointmentMock,
  }),
}));

describe("EditAppointmentPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();


  });

  it("renderiza o formulário com dados preenchidos", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<EditAppointmentPage />);

    expect(screen.getByText("Editar Consulta")).toBeInTheDocument();
    expect((screen.getByLabelText(/^Paciente/) as HTMLSelectElement).value).toBe("11");
    expect((screen.getByLabelText(/^M.dico/) as HTMLSelectElement).value).toBe("21");
    expect(screen.getByDisplayValue("2025-08-22T10:00")).toBeInTheDocument();
    expect((screen.getByLabelText(/^Status/) as HTMLSelectElement).value).toBe(AppointmentStatus.Confirmed.toString());
    expect(screen.getByDisplayValue("Observação inicial")).toBeInTheDocument();
  });

  it("atualiza os campos ao alterar inputs", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<EditAppointmentPage />);

    const patientSelect = screen.getByLabelText(/^Paciente/) as HTMLSelectElement;
    const doctorSelect = screen.getByLabelText(/^M.dico/) as HTMLSelectElement;
    const dateInput = screen.getByLabelText(/^Data da Consulta/) as HTMLInputElement;
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

  it("chama updateAppointment e navega ao submeter o formulário", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<EditAppointmentPage />);

    fireEvent.change(screen.getByLabelText(/^Paciente/), { target: { value: "11" } });
    fireEvent.change(screen.getByLabelText(/^M.dico/), { target: { value: "21" } });
    fireEvent.change(screen.getByLabelText(/^Data da Consulta/), { target: { value: "2025-08-23T14:00" } });
    fireEvent.change(screen.getByLabelText("Observações"), { target: { value: "Nova observação" } });

    fireEvent.click(screen.getByText("Salvar"));

    expect(updateAppointmentMock).toHaveBeenCalledTimes(1);
    expect(updateAppointmentMock).toHaveBeenCalledWith({
      id: 1,
      patientId: 11,
      doctorId: 21,
      appointmentDate: new Date("2025-08-23T14:00").toISOString(),
      status: AppointmentStatus.Confirmed,
      notes: "Nova observação",
    });

    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("navega ao clicar em Cancelar", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    render(<EditAppointmentPage />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("mantém paciente e médico selecionados com fixtures disponíveis", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });

    render(<EditAppointmentPage />);

    expect((screen.getByLabelText(/^Paciente/) as HTMLSelectElement).value).toBe("11");
    expect((screen.getByLabelText(/^M.dico/) as HTMLSelectElement).value).toBe("21");
  });
});
