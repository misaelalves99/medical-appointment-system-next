import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { Reminder } from "../domain/reminder";
import {
  REMINDER_REPOSITORY,
  type ReminderRepository,
} from "./ports/reminder-repository.port";

@Injectable()
export class ScheduleReminder {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly repository: ReminderRepository,
  ) {}

  async execute(
    appointmentId: string,
    scheduledFor: Date,
    now: Date = new Date(),
  ): Promise<Reminder> {
    if (!appointmentId.trim()) {
      throw new BadRequestException("Appointment id is required");
    }

    if (scheduledFor.getTime() <= now.getTime()) {
      throw new BadRequestException("Reminder must be scheduled in the future");
    }

    const reminder: Reminder = {
      appointmentId,
      scheduledFor,
      status: "scheduled",
    };

    await this.repository.save(reminder);
    return reminder;
  }
}
