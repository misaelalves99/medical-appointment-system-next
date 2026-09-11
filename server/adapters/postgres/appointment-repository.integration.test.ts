/** @jest-environment node */

import { sql } from "drizzle-orm";
import { createPostgresClient } from "../../db/client";
import { PostgresAppointmentRepository } from "./appointment-repository";

const databaseUrl = process.env.TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase("PostgresAppointmentRepository", () => {
  if (!databaseUrl) return;

  const client = createPostgresClient(databaseUrl);
  const repository = new PostgresAppointmentRepository(client.db);
  const ownerUserId = "11111111-1111-4111-8111-111111111111";

  beforeEach(async () => {
    await client.db.execute(sql.raw('DELETE FROM "appointments"'));
    await client.db.execute(sql.raw('DELETE FROM "refresh_sessions"'));
    await client.db.execute(sql.raw('DELETE FROM "users"'));
    await client.db.execute(sql.raw(
      `INSERT INTO "users" ("id","email","password_hash","role") VALUES ('${ownerUserId}','owner@example.test','synthetic-hash','PATIENT')`
    ));
  });

  afterAll(async () => { await client.pool.end(); });

  it("persists appointment ownership durably", async () => {
    const created = await repository.createIfNoOverlap({
      patientId: ownerUserId, practitionerId: "doctor-a", ownerUserId,
      startAt: "2030-01-01T10:00:00.000Z", endAt: "2030-01-01T10:30:00.000Z",
      reason: "Synthetic integration test",
    });
    expect(created).not.toBeNull();
    expect(created?.ownerUserId).toBe(ownerUserId);
    const result = await client.db.execute(sql.raw('SELECT "owner_user_id" FROM "appointments" LIMIT 1'));
    expect(result.rows[0]?.owner_user_id).toBe(ownerUserId);
  });

  it("allows only one winner for concurrent overlapping appointments", async () => {
    const first = repository.createIfNoOverlap({
      patientId: ownerUserId, practitionerId: "doctor-concurrency", ownerUserId,
      startAt: "2030-01-01T12:00:00.000Z", endAt: "2030-01-01T12:30:00.000Z",
    });
    const second = repository.createIfNoOverlap({
      patientId: ownerUserId, practitionerId: "doctor-concurrency", ownerUserId,
      startAt: "2030-01-01T12:15:00.000Z", endAt: "2030-01-01T12:45:00.000Z",
    });
    const results = await Promise.all([first, second]);
    expect(results.filter((value) => value !== null)).toHaveLength(1);
    expect(results.filter((value) => value === null)).toHaveLength(1);
  });
});
