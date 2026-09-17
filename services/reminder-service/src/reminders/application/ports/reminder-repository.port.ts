import type { Reminder } from "../../domain/reminder";

export const REMINDER_REPOSITORY = Symbol("REMINDER_REPOSITORY");

export interface ReminderRepository {
  save(reminder: Reminder): Promise<void>;
  findByAppointmentId(appointmentId: string): Promise<Reminder | null>;
}
