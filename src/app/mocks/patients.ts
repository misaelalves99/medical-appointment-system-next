// src/mocks/patients.ts

// ================== Pacientes ==================
export interface Patient {
  id: number;
  name: string;
  cpf: string;
  dateOfBirth: string; // ISO string (e.g. '1990-05-15')
  email: string;
  phone: string;
  address: string;
  gender: string;
  profilePicturePath?: string; 
}

export const patientsMock: Patient[] = [
  {
    id: 1,
    name: "Carlos Oliveira",
    cpf: "123.456.789-00",
    dateOfBirth: "1990-05-15",
    email: "carlos@email.com",
    phone: "3333-3333",
    address: "Rua A, 123",
    gender: "Masculino",
  },
  {
    id: 2,
    name: "Maria Lima",
    cpf: "987.654.321-00",
    dateOfBirth: "1985-10-20",
    email: "maria@email.com",
    phone: "4444-4444",
    address: "Rua B, 456",
    gender: "Feminino",
  },
];

// ================== Histórico de Pacientes ==================
export interface PatientHistoryItem {
  patientId: number;
  recordDate: string; // ISO string
  description: string;
  notes?: string | null;
}

export const patientsHistoryMock: PatientHistoryItem[] = [
  {
    patientId: 1,
    recordDate: "2025-08-01",
    description: "Consulta de rotina",
    notes: "Tudo dentro do esperado",
  },
  {
    patientId: 1,
    recordDate: "2025-08-10",
    description: "Exame de sangue",
    notes: "Alterações leves nos níveis de colesterol",
  },
  {
    patientId: 2,
    recordDate: "2025-07-15",
    description: "Consulta de alergia",
    notes: "Prescrito anti-histamínico",
  },
];
