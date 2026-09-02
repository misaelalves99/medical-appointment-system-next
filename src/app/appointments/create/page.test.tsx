// src/app/appointments/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreateAppointmentPage from "./page";
import { useRouter } from "next/navigation";
import { patientsMock } from "../../mocks/patients";
import { doctorsMock } from "../../mocks/doctors";
import { AppointmentStatus } from "../../types/Appointment";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../hooks/usePatient", () => ({
  usePatient: () => ({
    patients: patientsMock,
  }),
}));

const doctorFixture = [
  {
    id: doctorsMock[0].id,
    name: doctorsMock[0].name,
    crm: doctorsMock[0].crm,
    specialty: doctorsMock[0].specialty,
    email: doctorsMock[0].email,
    phone: doctorsMock[0].phone,
    isActive: doctorsMock[0].isActive,
  },
];

const addAppointmentMock = jest.fn();

jest.mock("../../hooks/useAppointments", () => ({
  useAppointments: () => ({
    addAppointment: addAppointmentMock,
  }),
}));
jest.mock("../../hooks/useDoctor", () => ({
  useDoctor: () => ({
    doctors: doctorFixture,
  }),
}));
describe("CreateAppointmentPage", () => {
  const pushMock = jest.fn();
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renderiza o formulário com campos e opções", () => {
    render(<CreateAppointmentPage />);

    expect(screen.getByText(/Cadastrar Consulta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Paciente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Médico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data da Consulta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Observações/i)).toBeInTheDocument();

    patientsMock.forEach((p) =>
      expect(screen.getByText(p.name)).toBeInTheDocument()
    );
    doctorFixture.forEach((d) =>
      expect(screen.getByText(d.name)).toBeInTheDocument()
    );

    ["Agendada", "Confirmada", "Cancelada", "Concluída"].forEach((s) =>
      expect(screen.getByText(s)).toBeInTheDocument()
    );
  });

  it("atualiza o state ao mudar inputs", () => {
    render(<CreateAppointmentPage />);

    fireEvent.change(screen.getByLabelText(/Paciente/i), {
      target: { value: patientsMock[0].id.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Médico/i), {
      target: { value: doctorsMock[0].id.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Data da Consulta/i), {
      target: { value: "2025-08-22T10:00" },
    });
    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: AppointmentStatus.Scheduled },
    });
    fireEvent.change(screen.getByLabelText(/Observações/i), {
      target: { value: "Teste observação" },
    });

    expect((screen.getByLabelText(/Paciente/i) as HTMLSelectElement).value).toBe(
      patientsMock[0].id.toString()
    );
    expect((screen.getByLabelText(/Médico/i) as HTMLSelectElement).value).toBe(
      doctorsMock[0].id.toString()
    );
    expect(
      (screen.getByLabelText(/Data da Consulta/i) as HTMLInputElement).value
    ).toBe("2025-08-22T10:00");
    expect((screen.getByLabelText(/Status/i) as HTMLSelectElement).value).toBe(AppointmentStatus.Scheduled.toString());
    expect((screen.getByLabelText(/Observações/i) as HTMLTextAreaElement).value).toBe(
      "Teste observação"
    );
  });

  it("cria nova consulta e navega ao submeter o formulário", () => {
    render(<CreateAppointmentPage />);

    fireEvent.change(screen.getByLabelText(/Paciente/i), {
      target: { value: patientsMock[0].id.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Médico/i), {
      target: { value: doctorsMock[0].id.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Data da Consulta/i), {
      target: { value: "2025-08-22T10:00" },
    });
    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: AppointmentStatus.Scheduled },
    });

    fireEvent.click(screen.getByText(/Salvar/i));
    expect(addAppointmentMock).toHaveBeenCalledTimes(1);
    expect(addAppointmentMock).toHaveBeenCalledWith({
      patientId: patientsMock[0].id,
      doctorId: doctorsMock[0].id,
      appointmentDate: new Date("2025-08-22T10:00").toISOString(),
      status: AppointmentStatus.Scheduled,
      notes: "",
    });
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("navega ao clicar em Cancelar", () => {
    render(<CreateAppointmentPage />);
    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("botões possuem classes CSS corretas", () => {
    render(<CreateAppointmentPage />);
    expect(screen.getByText(/Salvar/i)).toHaveClass("formSubmit");
    expect(screen.getByText(/Cancelar/i)).toHaveClass("formCancel");
  });
});
