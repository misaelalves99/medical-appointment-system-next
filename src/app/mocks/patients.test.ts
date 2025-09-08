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

  it("todos os ids de pacientes são únicos", () => {
    const ids = patientsMock.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("datas de nascimento são válidas ISO", () => {
    patientsMock.forEach(p => {
      const date = new Date(p.dateOfBirth);
      expect(!isNaN(date.getTime())).toBe(true); // data válida
      expect(date.toISOString().split("T")[0]).toBe(p.dateOfBirth); // formato YYYY-MM-DD
    });
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

  it("ids de paciente no histórico existem em patientsMock", () => {
    const patientIds = patientsMock.map(p => p.id);
    patientsHistoryMock.forEach(h => {
      expect(patientIds).toContain(h.patientId);
    });
  });

  it("datas de histórico são válidas ISO", () => {
    patientsHistoryMock.forEach(h => {
      const date = new Date(h.recordDate);
      expect(!isNaN(date.getTime())).toBe(true);
      expect(date.toISOString().split("T")[0]).toBe(h.recordDate); // formato YYYY-MM-DD
    });
  });

  it("não há múltiplos históricos com a mesma data para o mesmo paciente", () => {
    const grouped: Record<string, string[]> = {};
    patientsHistoryMock.forEach(h => {
      grouped[h.patientId] = grouped[h.patientId] || [];
      expect(grouped[h.patientId]).not.toContain(h.recordDate);
      grouped[h.patientId].push(h.recordDate);
    });
  });
});
