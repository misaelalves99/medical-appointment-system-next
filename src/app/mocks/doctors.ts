// src/mocks/doctors.ts

export interface Doctor {
  id: number;
  name: string;
  crm: string;
  specialty: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export const doctorsMock: Doctor[] = [
  {
    id: 1,
    name: "Dr. João Silva",
    crm: "123456",
    specialty: "Cardiologia",
    email: "joao.silva@hospital.com",
    phone: "(11) 99999-9999",
    isActive: true,
  },
  {
    id: 2,
    name: "Dra. Ana Paula",
    crm: "654321",
    specialty: "Dermatologia",
    email: "ana.paula@hospital.com",
    phone: "(11) 98888-8888",
    isActive: true,
  },
];

// Mock de disponibilidades dos médicos
export interface DoctorAvailability {
  doctorId: number;
  date: string; // formato ISO (ex: "2025-08-08")
  startTime: string; // ex: "08:00"
  endTime: string;   // ex: "12:00"
  isAvailable: boolean;
}

export const doctorAvailabilitiesMock: DoctorAvailability[] = [
  { doctorId: 1, date: "2025-08-20", startTime: "08:00", endTime: "12:00", isAvailable: true },
  { doctorId: 1, date: "2025-08-21", startTime: "14:00", endTime: "18:00", isAvailable: false },
  { doctorId: 2, date: "2025-08-20", startTime: "09:00", endTime: "13:00", isAvailable: true },
  { doctorId: 2, date: "2025-08-21", startTime: "15:00", endTime: "19:00", isAvailable: true },
];
