import type { PrismaClient } from "@prisma/client";
import type { ReminderRepository } from "../application/ports/reminder-repository.port";
import type { Reminder } from "../domain/reminder";
type ReminderDelegate = Pick<PrismaClient["reminderRecord"], "upsert" | "findUnique">;
export declare class PrismaReminderRepository implements ReminderRepository {
    private readonly reminders;
    constructor(reminders: ReminderDelegate);
    save(reminder: Reminder): Promise<void>;
    findByAppointmentId(appointmentId: string): Promise<Reminder | null>;
}
export {};
