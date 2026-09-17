"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryReminderRepository = void 0;
class InMemoryReminderRepository {
    reminders = new Map();
    async save(reminder) {
        this.reminders.set(reminder.appointmentId, reminder);
    }
    async findByAppointmentId(appointmentId) {
        return this.reminders.get(appointmentId) ?? null;
    }
}
exports.InMemoryReminderRepository = InMemoryReminderRepository;
//# sourceMappingURL=in-memory-reminder.repository.js.map