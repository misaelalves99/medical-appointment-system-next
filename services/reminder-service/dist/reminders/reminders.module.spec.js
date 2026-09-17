"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const reminder_repository_port_1 = require("./application/ports/reminder-repository.port");
const schedule_reminder_1 = require("./application/schedule-reminder");
const reminders_module_1 = require("./reminders.module");
describe("RemindersModule dependency injection", () => {
    it("resolves the use case and its repository port", async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [reminders_module_1.RemindersModule],
        }).compile();
        expect(moduleRef.get(schedule_reminder_1.ScheduleReminder)).toBeInstanceOf(schedule_reminder_1.ScheduleReminder);
        const repository = moduleRef.get(reminder_repository_port_1.REMINDER_REPOSITORY);
        expect(repository).toBeDefined();
        expect(typeof repository.save).toBe("function");
        expect(typeof repository.findByAppointmentId).toBe("function");
    });
});
//# sourceMappingURL=reminders.module.spec.js.map