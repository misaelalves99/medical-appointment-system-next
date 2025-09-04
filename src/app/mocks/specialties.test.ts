// src/mocks/specialties.test.ts

import { specialtiesMock } from "./specialties";

describe("specialtiesMock", () => {
  it("deve ser um array com pelo menos dois itens", () => {
    expect(Array.isArray(specialtiesMock)).toBe(true);
    expect(specialtiesMock.length).toBeGreaterThanOrEqual(2);
  });

  it("cada item deve ter propriedades corretas", () => {
    specialtiesMock.forEach((item) => {
      expect(typeof item.id).toBe("number");
      expect(typeof item.name).toBe("string");
      expect(typeof item.isActive).toBe("boolean");
    });
  });

  it("deve conter especialidades específicas", () => {
    const names = specialtiesMock.map((s) => s.name);
    expect(names).toContain("Cardiologia");
    expect(names).toContain("Dermatologia");
  });

  it("todos os ids são únicos", () => {
    const ids = specialtiesMock.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todos os itens possuem isActive como boolean", () => {
    specialtiesMock.forEach(s => {
      expect(typeof s.isActive).toBe("boolean");
    });
  });
});
