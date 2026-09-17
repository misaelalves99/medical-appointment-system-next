import type { Reminder } from "../domain/reminder";
import { ScheduleReminder } from "../application/schedule-reminder";
interface ScheduleReminderBody {
    appointmentId: string;
    scheduledFor: string;
}
export declare class RemindersController {
    private readonly scheduleReminder;
    constructor(scheduleReminder: ScheduleReminder);
    schedule(body: ScheduleReminderBody): Promise<Reminder>;
}
export {};
