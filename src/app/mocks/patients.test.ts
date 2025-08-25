// src/mocks/patients.test.ts

import { patientsMock, patientsHistoryMock } from "./patients";

describe("patientsMock", () => {
  it("deve ser um array com pelo menos dois pacientes", () => {
    expect(Array.isArray(patientsMock)).toBe(true);
    expect(patientsMock.length).toBeGreaterThanOrEqual(2);
  });

  it("cada paciente deve ter propriedades corretas", () => {
    patientsMock.forEach((patient) => {
      expect(typeof patient.id).toBe("number");
      expect(typeof patient.name).toBe("string");
      expect(typeof patient.cpf).toBe("string");
      expect(typeof patient.dateOfBirth).toBe("string");
      expect(typeof patient.email).toBe("string");
      expect(typeof patient.phone).toBe("string");
      expect(typeof patient.address).toBe("string");
      expect(typeof patient.gender).toBe("string");
    });
  });

  it("deve conter dados específicos do mock", () => {
    expect(patientsMock[0].name).toBe("Carlos Oliveira");
    expect(patientsMock[1].gender).toBe("Feminino");
  });
});

describe("patientsHistoryMock", () => {
  it("deve ser um array com itens de histórico", () => {
    expect(Array.isArray(patientsHistoryMock)).toBe(true);
    expect(patientsHistoryMock.length).toBeGreaterThanOrEqual(1);
  });

  it("cada item do histórico deve ter propriedades corretas", () => {
    patientsHistoryMock.forEach((history) => {
      expect(typeof history.patientId).toBe("number");
      expect(typeof history.recordDate).toBe("string");
      expect(typeof history.description).toBe("string");
      if (history.notes !== undefined) {
        expect(typeof history.notes === "string" || history.notes === null).toBe(true);
      }
    });
  });

  it("deve conter histórico para paciente específico", () => {
    const carlosHistory = patientsHistoryMock.filter(h => h.patientId === 1);
    expect(carlosHistory.length).toBeGreaterThanOrEqual(1);
    expect(carlosHistory[0].description).toBe("Consulta de rotina");
  });
});
