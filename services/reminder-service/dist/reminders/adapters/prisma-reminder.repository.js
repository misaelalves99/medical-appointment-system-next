"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaReminderRepository = void 0;
class PrismaReminderRepository {
    reminders;
    constructor(reminders) {
        this.reminders = reminders;
    }
    async save(reminder) {
        await this.reminders.upsert({
            where: { appointmentId: reminder.appointmentId },
            create: reminder,
            update: {
                scheduledFor: reminder.scheduledFor,
                status: reminder.status,
            },
        });
    }
    async findByAppointmentId(appointmentId) {
        const record = await this.reminders.findUnique({
            where: { appointmentId },
        });
        if (!record)
            return null;
        return {
            appointmentId: record.appointmentId,
            scheduledFor: record.scheduledFor,
            status: record.status,
        };
    }
}
exports.PrismaReminderRepository = PrismaReminderRepository;
//# sourceMappingURL=prisma-reminder.repository.js.map