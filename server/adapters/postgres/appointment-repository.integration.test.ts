/** @jest-environment node */

import { sql } from "drizzle-orm";
import { createPostgresClient } from "../../db/client";
import { PostgresAppointmentRepository } from "./appointment-repository";

const databaseUrl = process.env.TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase("PostgresAppointmentRepository", () => {
  if (!databaseUrl) {
    return;
  }

  const client = createPostgresClient(databaseUrl);
  const repository = new PostgresAppointmentRepository(client.db);

  beforeEach(async () => {
    await client.db.execute(sql.raw('DELETE FROM "appointments"'));
  });

  afterAll(async () => {
    await client.pool.end();
  });

  it("persists an appointment durably in the isolated test database", async () => {
    const created = await repository.createIfNoOverlap({
      patientId: "patient-a",
      practitionerId: "doctor-a",
      startAt: "2030-01-01T10:00:00.000Z",
      endAt: "2030-01-01T10:30:00.000Z",
      reason: "Synthetic integration test",
    });

    expect(created).not.toBeNull();

    const result = await client.db.execute(
      sql.raw('SELECT COUNT(*)::int AS count FROM "appointments"'),
    );
    expect(Number(result.rows[0]?.count)).toBe(1);
  });

  it("allows only one winner for concurrent overlapping appointments", async () => {
    const first = repository.createIfNoOverlap({
      patientId: "patient-a",
      practitionerId: "doctor-concurrency",
      startAt: "2030-01-01T12:00:00.000Z",
      endAt: "2030-01-01T12:30:00.000Z",
    });
    const second = repository.createIfNoOverlap({
      patientId: "patient-b",
      practitionerId: "doctor-concurrency",
      startAt: "2030-01-01T12:15:00.000Z",
      endAt: "2030-01-01T12:45:00.000Z",
    });

    const results = await Promise.all([first, second]);
    expect(results.filter((value) => value !== null)).toHaveLength(1);
    expect(results.filter((value) => value === null)).toHaveLength(1);
  });
});
