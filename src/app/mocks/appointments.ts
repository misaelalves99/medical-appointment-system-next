// src/mocks/appointments.ts

import { AppointmentStatus, Appointment as AppointmentType } from '../types/Appointment';

export const appointmentsMock: AppointmentType[] = [
  {
    id: 1,
    patientId: 1,
    patientName: "João da Silva",
    doctorId: 2,
    doctorName: "Dra. Maria Oliveira",
    appointmentDate: "2025-08-15T14:30:00Z",
    status: AppointmentStatus.Confirmed,
    notes: "Paciente apresentou melhora significativa.",
  },
];
