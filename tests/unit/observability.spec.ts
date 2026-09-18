import { safeAttributes, structuredLog } from "../../server/observability";

describe("bounded observability", () => {
  test("redacts sensitive attribute keys", () => {
    expect(safeAttributes({
      route: "/graphql", method: "POST", authorization: "Bearer secret",
      cookie: "session=x", patientPayload: "private", token: "x",
    })).toEqual({ route: "/graphql", method: "POST" });

    expect(safeAttributes({
      route: "/graphql",
      method: "POST",
      innocentKey: "Bearer secret-value",
      ownerId: "synthetic-owner",
      durationMs: 12,
    })).toEqual({ route: "/graphql", method: "POST", durationMs: 12 });
  });

  test("writes structured low-cardinality JSON without sensitive values", () => {
    const spy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    structuredLog("http.request", { route: "/graphql", status: 200, secret: "x" });
    const line = String(spy.mock.calls[0][0]);
    expect(JSON.parse(line)).toEqual({ event: "http.request", route: "/graphql", status: 200 });
    expect(line).not.toContain('"x"');
    spy.mockRestore();
  });
});
