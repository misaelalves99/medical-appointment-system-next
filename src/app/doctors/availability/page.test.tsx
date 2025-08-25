// src/app/doctor/availability/page.test.tsx

import { render, screen } from "@testing-library/react";
import DoctorAvailabilityPage from "./page";
import "@testing-library/jest-dom";
import { doctorsMock, doctorAvailabilitiesMock } from "../../mocks/doctors";

describe("DoctorAvailabilityPage", () => {
  it("renderiza o título da página", () => {
    render(<DoctorAvailabilityPage />);
    expect(screen.getByRole("heading", { name: /disponibilidade dos médicos/i })).toBeInTheDocument();
  });

  it("renderiza a tabela com todas as disponibilidades", () => {
    render(<DoctorAvailabilityPage />);
    const rows = screen.getAllByRole("row");
    // +1 para o header da tabela
    expect(rows.length).toBe(doctorAvailabilitiesMock.length + 1);
  });

  it("exibe corretamente os nomes dos médicos", () => {
    render(<DoctorAvailabilityPage />);
    doctorAvailabilitiesMock.forEach((availability) => {
      const doctor = doctorsMock.find(d => d.id === availability.doctorId);
      const doctorName = doctor ? doctor.name : `ID ${availability.doctorId}`;
      expect(screen.getByText(doctorName)).toBeInTheDocument();
    });
  });

  it("exibe corretamente datas, horários e disponibilidade", () => {
    render(<DoctorAvailabilityPage />);
    doctorAvailabilitiesMock.forEach((availability) => {
      expect(screen.getByText(new Date(availability.date).toLocaleDateString("pt-BR"))).toBeInTheDocument();
      expect(screen.getByText(availability.startTime)).toBeInTheDocument();
      expect(screen.getByText(availability.endTime)).toBeInTheDocument();
      expect(screen.getByText(availability.isAvailable ? "Sim" : "Não")).toBeInTheDocument();
    });
  });

  it("possui link de voltar para /doctor", () => {
    render(<DoctorAvailabilityPage />);
    const backLink = screen.getByRole("link", { name: /voltar/i });
    expect(backLink).toHaveAttribute("href", "/doctor");
  });
});
