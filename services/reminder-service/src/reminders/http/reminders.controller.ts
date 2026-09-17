import { Body, Controller, Post } from "@nestjs/common";
import type { Reminder } from "../domain/reminder";
import { ScheduleReminder } from "../application/schedule-reminder";

interface ScheduleReminderBody {
  appointmentId: string;
  scheduledFor: string;
}

@Controller("reminders")
export class RemindersController {
  constructor(private readonly scheduleReminder: ScheduleReminder) {}

  @Post()
  async schedule(@Body() body: ScheduleReminderBody): Promise<Reminder> {
    return this.scheduleReminder.execute(
      body.appointmentId,
      new Date(body.scheduledFor),
    );
  }
}
