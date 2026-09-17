import type { ReminderRepository } from "../application/ports/reminder-repository.port";
import type { Reminder } from "../domain/reminder";

export class InMemoryReminderRepository implements ReminderRepository {
  private readonly reminders = new Map<string, Reminder>();

  async save(reminder: Reminder): Promise<void> {
    this.reminders.set(reminder.appointmentId, reminder);
  }

  async findByAppointmentId(appointmentId: string): Promise<Reminder | null> {
    return this.reminders.get(appointmentId) ?? null;
  }
}
