/** @jest-environment node */

import { createPostgresClient } from "../db/client";
import { PostgresAuthRepository } from "./postgres-auth-repository";
import { createAuthService } from "./service";
import { verifyAccessToken } from "./token";

const describeWithDatabase = process.env.TEST_DATABASE_URL ? describe : describe.skip;

describeWithDatabase("Stage04 auth integration", () => {
  const connectionString = process.env.TEST_DATABASE_URL as string;
  const secret = "stage04-synthetic-access-secret-at-least-32-characters";
  const { db, pool } = createPostgresClient(connectionString);
  const repository = new PostgresAuthRepository(db);
  const service = createAuthService(repository, {
    accessTokenSecret: secret,
    accessTokenTtlSeconds: 60,
    refreshTokenTtlMs: 60_000,
  });

  afterAll(async () => {
    await pool.end();
  });

  it("registers, logs in, rotates refresh token, and verifies access identity", async () => {
    const email = `synthetic-${Date.now()}@example.test`;
    const password = "Synthetic-Stage04-Password-123!";

    const registered = await service.register({
      email,
      password,
      role: "PATIENT",
    });

    const principal = await verifyAccessToken(registered.accessToken, secret);
    expect(principal.sub).toBe(registered.user.id);
    expect(principal.role).toBe("PATIENT");

    const loggedIn = await service.login(email, password);
    expect(loggedIn.user.id).toBe(registered.user.id);

    const rotated = await service.refresh(loggedIn.refreshToken);
    expect(rotated.refreshToken).not.toBe(loggedIn.refreshToken);

    await expect(service.refresh(loggedIn.refreshToken)).rejects.toMatchObject({
      code: "INVALID_REFRESH_TOKEN",
    });

    await service.logout(rotated.refreshToken);
    await expect(service.refresh(rotated.refreshToken)).rejects.toMatchObject({
      code: "INVALID_REFRESH_TOKEN",
    });
  });
});
