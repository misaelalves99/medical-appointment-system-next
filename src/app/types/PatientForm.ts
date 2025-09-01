// src/types/PatientForm.ts

export interface PatientForm {
  name: string;
  cpf: string;
  dateOfBirth: string; // formato "yyyy-mm-dd"
  email: string;
  phone: string;
  address: string;
  gender: string; // "Masculino" | "Feminino" | "Outro"
}
