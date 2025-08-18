// src/mocks/specialties.ts

export interface Specialty {
  id: number;
  name: string;
  // add other properties if needed
}

export const specialtiesMock: Specialty[] = [
  { id: 1, name: "Cardiologia" },
  { id: 2, name: "Dermatologia" },
];
