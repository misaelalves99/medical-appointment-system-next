"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_reminder_repository_1 = require("./prisma-reminder.repository");
describe("PrismaReminderRepository", () => {
    it("upserts a reminder using appointment id ownership", async () => {
        const delegate = {
            upsert: jest.fn().mockResolvedValue({}),
            findUnique: jest.fn(),
        };
        const repository = new prisma_reminder_repository_1.PrismaReminderRepository(delegate);
        const scheduledFor = new Date("2026-09-17T13:00:00.000Z");
        await repository.save({
            appointmentId: "appointment-123",
            scheduledFor,
            status: "scheduled",
        });
        expect(delegate.upsert).toHaveBeenCalledWith({
            where: { appointmentId: "appointment-123" },
            create: {
                appointmentId: "appointment-123",
                scheduledFor,
                status: "scheduled",
            },
            update: { scheduledFor, status: "scheduled" },
        });
    });
    it("maps a Prisma record back to the domain shape", async () => {
        const scheduledFor = new Date("2026-09-17T13:00:00.000Z");
        const delegate = {
            upsert: jest.fn(),
            findUnique: jest.fn().mockResolvedValue({
                id: "record-1",
                appointmentId: "appointment-123",
                scheduledFor,
                status: "scheduled",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        };
        const repository = new prisma_reminder_repository_1.PrismaReminderRepository(delegate);
        await expect(repository.findByAppointmentId("appointment-123")).resolves.toEqual({
            appointmentId: "appointment-123",
            scheduledFor,
            status: "scheduled",
        });
    });
    it("returns null when Prisma finds no bounded reminder record", async () => {
        const delegate = {
            upsert: jest.fn(),
            findUnique: jest.fn().mockResolvedValue(null),
        };
        const repository = new prisma_reminder_repository_1.PrismaReminderRepository(delegate);
        await expect(repository.findByAppointmentId("missing")).resolves.toBeNull();
    });
});
//# sourceMappingURL=prisma-reminder.repository.spec.js.map