import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: text("patient_id").notNull(),
  practitionerId: text("practitioner_id").notNull(),
  startAt: timestamp("starts_at", { withTimezone: true, mode: "date" }).notNull(),
  endAt: timestamp("ends_at", { withTimezone: true, mode: "date" }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});
