// src/types/Patient.ts

export interface Patient {
  id?: number;             // pode ser opcional se estiver criando um novo paciente
  name: string;
  cpf: string;
  dateOfBirth: string;     // string ISO, ex: '1990-05-15'
  email: string;
  phone: string;
  address: string;
  gender?: string;         // opcional, pois pode não ser obrigatório em todos casos
  // Você pode incluir outros campos que usar no seu projeto
}
