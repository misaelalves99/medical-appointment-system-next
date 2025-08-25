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
});
