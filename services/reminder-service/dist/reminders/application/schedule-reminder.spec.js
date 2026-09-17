"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schedule_reminder_1 = require("./schedule-reminder");
describe("ScheduleReminder", () => {
    let repository;
    let useCase;
    beforeEach(() => {
        repository = {
            save: jest.fn().mockResolvedValue(undefined),
            findByAppointmentId: jest.fn().mockResolvedValue(null),
        };
        useCase = new schedule_reminder_1.ScheduleReminder(repository);
    });
    it("schedules and persists a future reminder", async () => {
        const now = new Date("2026-09-17T12:00:00.000Z");
        const scheduledFor = new Date("2026-09-17T13:00:00.000Z");
        const result = await useCase.execute("appointment-123", scheduledFor, now);
        expect(result).toEqual({
            appointmentId: "appointment-123",
            scheduledFor,
            status: "scheduled",
        });
        expect(repository.save).toHaveBeenCalledWith(result);
    });
    it("rejects a reminder that is not in the future", async () => {
        const now = new Date("2026-09-17T12:00:00.000Z");
        await expect(useCase.execute("appointment-123", now, now))
            .rejects.toThrow("Reminder must be scheduled in the future");
        expect(repository.save).not.toHaveBeenCalled();
    });
    it("requires an appointment id", async () => {
        const now = new Date("2026-09-17T12:00:00.000Z");
        const scheduledFor = new Date("2026-09-17T13:00:00.000Z");
        await expect(useCase.execute("   ", scheduledFor, now))
            .rejects.toThrow("Appointment id is required");
        expect(repository.save).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=schedule-reminder.spec.js.map