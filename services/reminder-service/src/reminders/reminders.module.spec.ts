import { Test } from "@nestjs/testing";
import { REMINDER_REPOSITORY, type ReminderRepository } from "./application/ports/reminder-repository.port";
import { ScheduleReminder } from "./application/schedule-reminder";
import { RemindersModule } from "./reminders.module";

describe("RemindersModule dependency injection", () => {
  it("resolves the use case and its repository port", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RemindersModule],
    }).compile();

    expect(moduleRef.get(ScheduleReminder)).toBeInstanceOf(ScheduleReminder);
    const repository = moduleRef.get<ReminderRepository>(REMINDER_REPOSITORY);
    expect(repository).toBeDefined();
    expect(typeof repository.save).toBe("function");
    expect(typeof repository.findByAppointmentId).toBe("function");
  });
});
