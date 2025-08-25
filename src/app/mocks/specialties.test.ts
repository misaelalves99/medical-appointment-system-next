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
    });
  });

  it("deve conter especialidades específicas", () => {
    const names = specialtiesMock.map((s) => s.name);
    expect(names).toContain("Cardiologia");
    expect(names).toContain("Dermatologia");
  });
});
