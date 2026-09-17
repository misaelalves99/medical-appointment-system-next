import { getTableName } from "drizzle-orm";
import { outboxEvents } from "../../server/db/schema";

describe("outboxEvents schema", () => {
  it("owns a bounded transactional outbox table", () => {
    expect(getTableName(outboxEvents)).toBe("outbox_events");
    expect(Object.keys(outboxEvents)).toEqual(
      expect.arrayContaining([
        "id",
        "eventType",
        "aggregateId",
        "payload",
        "occurredAt",
        "publishedAt",
      ]),
    );
  });
});
