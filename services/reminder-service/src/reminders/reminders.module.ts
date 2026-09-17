import { Module } from "@nestjs/common";
import { InMemoryReminderRepository } from "./adapters/in-memory-reminder.repository";
import { REMINDER_REPOSITORY } from "./application/ports/reminder-repository.port";
import { ScheduleReminder } from "./application/schedule-reminder";
import { RemindersController } from "./http/reminders.controller";

@Module({
  controllers: [RemindersController],
  providers: [
    ScheduleReminder,
    {
      provide: REMINDER_REPOSITORY,
      useClass: InMemoryReminderRepository,
    },
  ],
})
export class RemindersModule {}
