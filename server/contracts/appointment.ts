import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().trim().min(1),
  practitionerId: z.string().trim().min(1),
  startAt: z.string().datetime({ offset: true }),
  endAt: z.string().datetime({ offset: true }),
  reason: z.string().trim().min(1).max(500).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export interface AppointmentDto {
  id: string;
  patientId: string;
  practitionerId: string;
  startAt: string;
  endAt: string;
  reason?: string;
}