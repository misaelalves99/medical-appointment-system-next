// src/types/Appointment.ts

export enum AppointmentStatus {
  Scheduled = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3,
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName?: string | null;
  doctorId: number;
  doctorName?: string | null;
  appointmentDate: string; // ISO string
  status: AppointmentStatus;
  notes?: string | null;
}
