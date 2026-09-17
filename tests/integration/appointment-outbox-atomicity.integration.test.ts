import { randomUUID } from "crypto";
import { TextDecoder, TextEncoder } from "util";

Object.assign(globalThis, { TextEncoder, TextDecoder });

const { eq } = require("drizzle-orm") as typeof import("drizzle-orm");
const { drizzle } = require("drizzle-orm/node-postgres") as typeof import("drizzle-orm/node-postgres");
const { Pool } = require("pg") as typeof import("pg");

const connectionString = process.env.TEST_DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;
const db = pool ? drizzle(pool) : null;
import { appointments, outboxEvents } from "../../server/db/schema";

const describeDb = connectionString && pool && db ? describe : describe.skip;

describeDb("appointment + outbox PostgreSQL atomicity", () => {
  // Keep tests registered even when this suite is skipped by the ordinary
  // root regression. The non-null aliases are only executed when
  // TEST_DATABASE_URL selected `describe` above.
  const runtimeDb = db!;
  const runtimePool = pool!;
  const ids: string[] = [];

  afterAll(async () => {
    for (const id of ids) {
      await runtimeDb.delete(outboxEvents).where(eq(outboxEvents.aggregateId, id));
      await runtimeDb.delete(appointments).where(eq(appointments.patientId, id));
    }
    await runtimePool.end();
  });

  it("commits appointment and outbox together", async () => {
    const appointmentId = randomUUID();
    const eventId = randomUUID();
    ids.push(appointmentId);

    await runtimeDb.transaction(async (tx) => {
      await tx.insert(appointments).values({
        patientId: appointmentId,
        practitionerId: appointmentId,
        startAt: new Date("2030-01-01T12:00:00.000Z"),
        endAt: new Date("2030-01-01T12:30:00.000Z"),
        reason: "synthetic-stage03-atomicity",
      });
      await tx.insert(outboxEvents).values({
        id: eventId,
        eventType: "appointment.reminder.requested.v1",
        aggregateId: appointmentId,
        payload: { appointmentId, scheduledFor: "2030-01-01T12:00:00.000Z" },
        occurredAt: new Date(),
      });
    });

    expect((await runtimeDb.select().from(appointments).where(eq(appointments.patientId, appointmentId))).length).toBe(1);
    expect((await runtimeDb.select().from(outboxEvents).where(eq(outboxEvents.aggregateId, appointmentId))).length).toBe(1);
  });

  it("rolls back appointment when second write fails", async () => {
    const appointmentId = randomUUID();
    ids.push(appointmentId);

    await expect(runtimeDb.transaction(async (tx) => {
      await tx.insert(appointments).values({
        patientId: appointmentId,
        practitionerId: appointmentId,
        startAt: new Date("2030-01-02T12:00:00.000Z"),
        endAt: new Date("2030-01-02T12:30:00.000Z"),
        reason: "synthetic-stage03-rollback",
      });
      throw new Error("forced-second-write-failure-before-outbox-insert");
    })).rejects.toThrow("forced-second-write-failure-before-outbox-insert");

    expect((await runtimeDb.select().from(appointments).where(eq(appointments.patientId, appointmentId))).length).toBe(0);
    expect((await runtimeDb.select().from(outboxEvents).where(eq(outboxEvents.aggregateId, appointmentId))).length).toBe(0);
  });
});
