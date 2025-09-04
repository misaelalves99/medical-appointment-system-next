// src/app/appointments/create/page.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import CreateAppointmentPage from "./page";
import { useRouter } from "next/navigation";
import { patientsMock } from "../../mocks/patients";
import { doctorsMock } from "../../mocks/doctors";
import { appointmentsMock } from "../../mocks/appointments";
import { AppointmentStatus } from "../../types/Appointment";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CreateAppointmentPage", () => {
  const pushMock = jest.fn();
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
    appointmentsMock.length = 0; // reset do mock
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("renderiza o formulário com campos e opções", () => {
    render(<CreateAppointmentPage params={{ id: "1" }} />);

    expect(screen.getByText(/Nova Consulta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Paciente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Médico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data da Consulta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Observações/i)).toBeInTheDocument();

    patientsMock.forEach((p) =>
      expect(screen.getByText(p.name)).toBeInTheDocument()
    );
    doctorsMock.forEach((d) =>
      expect(screen.getByText(d.name)).toBeInTheDocument()
    );

    const statusOptions = ["Agendada", "Confirmada", "Cancelada", "Concluída"];
    statusOptions.forEach((s) => expect(screen.getByText(s)).toBeInTheDocument());
  });

  it("atualiza o state ao mudar inputs", () => {
    render(<CreateAppointmentPage params={{ id: "1" }} />);

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
    expect((screen.getByLabelText(/Status/i) as HTMLSelectElement).value).toBe(
      AppointmentStatus.Scheduled
    );
    expect((screen.getByLabelText(/Observações/i) as HTMLTextAreaElement).value).toBe(
      "Teste observação"
    );
  });

  it("cria nova consulta e navega ao submeter o formulário", () => {
    render(<CreateAppointmentPage params={{ id: "1" }} />);

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

    expect(appointmentsMock.length).toBe(1);
    expect(appointmentsMock[0].patientId).toBe(patientsMock[0].id);
    expect(appointmentsMock[0].doctorId).toBe(doctorsMock[0].id);
    expect(appointmentsMock[0].appointmentDate).toBe("2025-08-22T10:00");
    expect(consoleSpy).toHaveBeenCalledWith("Nova consulta criada:", appointmentsMock[0]);
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("navega ao clicar em Cancelar", () => {
    render(<CreateAppointmentPage params={{ id: "1" }} />);
    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(pushMock).toHaveBeenCalledWith("/appointments");
  });

  it("botões possuem classes CSS corretas", () => {
    render(<CreateAppointmentPage params={{ id: "1" }} />);
    expect(screen.getByText(/Salvar/i)).toHaveClass("formSubmit");
    expect(screen.getByText(/Cancelar/i)).toHaveClass("formCancel");
  });
});
