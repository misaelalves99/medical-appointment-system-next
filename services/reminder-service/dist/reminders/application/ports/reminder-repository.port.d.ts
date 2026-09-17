import type { Reminder } from "../../domain/reminder";
export declare const REMINDER_REPOSITORY: unique symbol;
export interface ReminderRepository {
    save(reminder: Reminder): Promise<void>;
    findByAppointmentId(appointmentId: string): Promise<Reminder | null>;
}
