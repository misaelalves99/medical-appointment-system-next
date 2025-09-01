// src/mocks/specialties.ts

export interface Specialty {
  id: number;
  name: string;
  isActive: boolean;
}

export const specialtiesMock: Specialty[] = [
  { id: 1, name: "Cardiologia", isActive: true },
  { id: 2, name: "Dermatologia", isActive: true },
];
