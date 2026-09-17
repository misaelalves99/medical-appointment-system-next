import type { Reminder } from "../domain/reminder";
import { InMemoryReminderRepository } from "./in-memory-reminder.repository";

describe("InMemoryReminderRepository", () => {
  it("persists and retrieves a reminder by appointment id", async () => {
    const repository = new InMemoryReminderRepository();
    const reminder: Reminder = {
      appointmentId: "appointment-123",
      scheduledFor: new Date("2026-09-17T13:00:00.000Z"),
      status: "scheduled",
    };

    await repository.save(reminder);

    await expect(repository.findByAppointmentId("appointment-123"))
      .resolves.toEqual(reminder);
  });

  it("returns null when no reminder exists", async () => {
    const repository = new InMemoryReminderRepository();

    await expect(repository.findByAppointmentId("missing"))
      .resolves.toBeNull();
  });
});
