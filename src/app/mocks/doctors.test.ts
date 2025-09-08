// src/mocks/doctors.test.ts

import { doctorsMock, doctorAvailabilitiesMock } from "./doctors";

describe("doctorsMock", () => {
  it("deve ser um array com pelo menos dois médicos", () => {
    expect(Array.isArray(doctorsMock)).toBe(true);
    expect(doctorsMock.length).toBeGreaterThanOrEqual(2);
  });

  it("cada médico deve ter propriedades corretas", () => {
    doctorsMock.forEach((doctor) => {
      expect(typeof doctor.id).toBe("number");
      expect(typeof doctor.name).toBe("string");
      expect(typeof doctor.crm).toBe("string");
      expect(typeof doctor.specialty).toBe("string");
      expect(typeof doctor.email).toBe("string");
      expect(typeof doctor.phone).toBe("string");
      expect(typeof doctor.isActive).toBe("boolean");
    });
  });

  it("deve conter dados específicos do mock", () => {
    expect(doctorsMock[0].name).toBe("Dr. João Silva");
    expect(doctorsMock[1].specialty).toBe("Dermatologia");
  });

  it("todos os ids de médicos são únicos", () => {
    const ids = doctorsMock.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("doctorAvailabilitiesMock", () => {
  it("deve ser um array com objetos válidos", () => {
    expect(Array.isArray(doctorAvailabilitiesMock)).toBe(true);
    doctorAvailabilitiesMock.forEach((avail) => {
      expect(typeof avail.doctorId).toBe("number");
      expect(typeof avail.date).toBe("string");
      expect(typeof avail.startTime).toBe("string");
      expect(typeof avail.endTime).toBe("string");
      expect(typeof avail.isAvailable).toBe("boolean");
    });
  });

  it("deve conter dados de disponibilidade corretos", () => {
    const avail = doctorAvailabilitiesMock.find(a => a.doctorId === 1 && a.date === "2025-08-20");
    expect(avail).toBeDefined();
    expect(avail?.isAvailable).toBe(true);
  });

  it("datas de disponibilidade são válidas ISO", () => {
    doctorAvailabilitiesMock.forEach(a => {
      expect(!isNaN(Date.parse(a.date))).toBe(true);
    });
  });

  it("horários de disponibilidade são consistentes (startTime < endTime)", () => {
    doctorAvailabilitiesMock.forEach(a => {
      const [startHour, startMin] = a.startTime.split(":").map(Number);
      const [endHour, endMin] = a.endTime.split(":").map(Number);
      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;
      expect(endTotal).toBeGreaterThan(startTotal);
    });
  });

  it("não há sobreposição de horários para o mesmo médico na mesma data", () => {
    const grouped: Record<string, { start: number; end: number }[]> = {};
    doctorAvailabilitiesMock.forEach(a => {
      const key = `${a.doctorId}-${a.date}`;
      const start = Number(a.startTime.split(":")[0]) * 60 + Number(a.startTime.split(":")[1]);
      const end = Number(a.endTime.split(":")[0]) * 60 + Number(a.endTime.split(":")[1]);
      grouped[key] = grouped[key] || [];
      grouped[key].forEach(slot => {
        expect(start >= slot.end || end <= slot.start).toBe(true); // sem sobreposição
      });
      grouped[key].push({ start, end });
    });
  });

  it("datas e horários seguem formato correto (ISO e 24h HH:mm)", () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    const timeRegex = /^\d{2}:\d{2}$/;       // HH:mm

    doctorAvailabilitiesMock.forEach(a => {
      expect(a.date).toMatch(dateRegex);
      expect(a.startTime).toMatch(timeRegex);
      expect(a.endTime).toMatch(timeRegex);
    });
  });
});
