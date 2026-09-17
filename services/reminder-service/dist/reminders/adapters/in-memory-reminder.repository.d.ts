import type { ReminderRepository } from "../application/ports/reminder-repository.port";
import type { Reminder } from "../domain/reminder";
export declare class InMemoryReminderRepository implements ReminderRepository {
    private readonly reminders;
    save(reminder: Reminder): Promise<void>;
    findByAppointmentId(appointmentId: string): Promise<Reminder | null>;
}
