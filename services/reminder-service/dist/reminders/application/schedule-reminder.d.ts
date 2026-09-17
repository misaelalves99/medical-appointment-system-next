import type { Reminder } from "../domain/reminder";
import { type ReminderRepository } from "./ports/reminder-repository.port";
export declare class ScheduleReminder {
    private readonly repository;
    constructor(repository: ReminderRepository);
    execute(appointmentId: string, scheduledFor: Date, now?: Date): Promise<Reminder>;
}
