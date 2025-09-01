// src/types/AppointmentForm.ts

export interface AppointmentForm {
  patientId: string;
  doctorId: string;
  appointmentDate: string; // formato ISO ou datetime-local
  status: string;           // valores como "1", "2", "3", etc.
  notes: string;
}

export interface Option {
  value: string;
  label: string;
}
