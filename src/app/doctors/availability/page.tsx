// src/app/doctor/availability/page.test.tsx

import { render, screen } from "@testing-library/react";
import DoctorAvailabilityPage from "./page";
import "@testing-library/jest-dom";
import { doctorsMock, doctorAvailabilitiesMock } from "../../mocks/doctors";

describe("DoctorAvailabilityPage", () => {
  beforeEach(() => {
    render(<DoctorAvailabilityPage />);
  });

  it("renderiza o título da página", () => {
    expect(screen.getByRole("heading", { name: /disponibilidade dos médicos/i })).toBeInTheDocument();
  });

  it("possui container principal com classe correta", () => {
    const container = screen.getByText(/Disponibilidade dos Médicos/i).parentElement;
    expect(container).toHaveClass("availabilityContainer");
  });

  it("renderiza a tabela com todas as disponibilidades", () => {
    const rows = screen.getAllByRole("row");
    // +1 para o header da tabela
    expect(rows.length).toBe(doctorAvailabilitiesMock.length + 1);
  });

  it("exibe corretamente os nomes dos médicos e fallback para IDs desconhecidos", () => {
    doctorAvailabilitiesMock.forEach((availability) => {
      const doctor = doctorsMock.find(d => d.id === availability.doctorId);
      const doctorName = doctor ? doctor.name : `ID ${availability.doctorId}`;
      expect(screen.getByText(doctorName)).toBeInTheDocument();
    });
  });

  it("exibe corretamente datas, horários e disponibilidade", () => {
    doctorAvailabilitiesMock.forEach((availability) => {
      expect(screen.getByText(new Date(availability.date).toLocaleDateString("pt-BR"))).toBeInTheDocument();
      expect(screen.getByText(availability.startTime)).toBeInTheDocument();
      expect(screen.getByText(availability.endTime)).toBeInTheDocument();
      expect(screen.getByText(availability.isAvailable ? "Sim" : "Não")).toBeInTheDocument();
    });
  });

  it("tabela está ordenada corretamente por data e hora", () => {
    const rows = screen.getAllByRole("row").slice(1); // Ignora o header
    const times = rows.map(row => {
      const [ , dateCell, startCell ] = row.querySelectorAll("td");
      return new Date(`${dateCell.textContent?.split("/").reverse().join("-")}T${startCell.textContent}`);
    });
    for (let i = 1; i < times.length; i++) {
      expect(times[i].getTime()).toBeGreaterThanOrEqual(times[i-1].getTime());
    }
  });

  it("possui link de voltar para /doctor com classe correta", () => {
    const backLink = screen.getByRole("link", { name: /voltar/i });
    expect(backLink).toHaveAttribute("href", "/doctor");
    expect(backLink).toHaveClass("backLink");
  });
});
