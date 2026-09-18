/** @jest-environment node */
import http from "http";
import { createFirstPartyHttpComposition } from "./composition";

const databaseUrl = process.env.TEST_DATABASE_URL;
const accessTokenSecret = "c3-s05-local-synthetic-secret-at-least-32-chars";

describe("first-party HTTP composition runtime", () => {
  it("boots against local PostgreSQL and exposes bounded auth/GraphQL/SSE HTTP boundaries", async () => {
    if (!databaseUrl) throw new Error("TEST_DATABASE_URL is required for this controlled local runtime proof.");

    const composition = createFirstPartyHttpComposition({ databaseUrl, accessTokenSecret });
    const server = composition.app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("runtime address unavailable");
    const base = `http://127.0.0.1:${address.port}`;

    try {
      const graphql = await fetch(`${base}/graphql`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: "{ appointment(id: \"00000000-0000-4000-8000-000000000000\") { id } }" }),
      });
      expect(graphql.status).toBe(401);

      const sse = await fetch(`${base}/api/appointments/00000000-0000-4000-8000-000000000000/status-stream`);
      expect(sse.status).toBe(401);

      const appointments = await fetch(`${base}/api/appointments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      expect(appointments.status).toBe(401);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => error ? reject(error) : resolve()),
      );
      await composition.close();
    }
  });
});
