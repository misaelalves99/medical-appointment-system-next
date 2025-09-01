// src/types/Specialty.ts

export interface Specialty {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

// Tipo para formulários de criação/edição
export interface SpecialtyFormState {
  name: string;
  description?: string;
  isActive: boolean;
}
