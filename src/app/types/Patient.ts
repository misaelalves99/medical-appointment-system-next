// src/types/Patient.ts

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  gender?: string;
  profilePicturePath?: string;
}
