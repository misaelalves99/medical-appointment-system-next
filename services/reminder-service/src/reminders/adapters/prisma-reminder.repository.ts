import type { PrismaClient, ReminderRecord } from "@prisma/client";
import type { ReminderRepository } from "../application/ports/reminder-repository.port";
import type { Reminder } from "../domain/reminder";

type ReminderDelegate = Pick<PrismaClient["reminderRecord"], "upsert" | "findUnique">;

export class PrismaReminderRepository implements ReminderRepository {
  constructor(private readonly reminders: ReminderDelegate) {}

  async save(reminder: Reminder): Promise<void> {
    await this.reminders.upsert({
      where: { appointmentId: reminder.appointmentId },
      create: reminder,
      update: {
        scheduledFor: reminder.scheduledFor,
        status: reminder.status,
      },
    });
  }

  async findByAppointmentId(appointmentId: string): Promise<Reminder | null> {
    const record: ReminderRecord | null = await this.reminders.findUnique({
      where: { appointmentId },
    });
    if (!record) return null;
    return {
      appointmentId: record.appointmentId,
      scheduledFor: record.scheduledFor,
      status: record.status as Reminder["status"],
    };
  }
}
