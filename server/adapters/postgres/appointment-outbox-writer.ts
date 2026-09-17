import { appointments, outboxEvents } from "../../db/schema";
import type { ReminderRequestedEvent } from "../../domain/outbox-event";

export async function writeAppointmentAndOutbox(
  tx: { insert: (table: unknown) => { values: (value: unknown) => Promise<unknown> } },
  appointment: typeof appointments.$inferInsert,
  event: ReminderRequestedEvent,
): Promise<void> {
  await tx.insert(appointments).values(appointment);
  await tx.insert(outboxEvents).values({
    id: event.eventId,
    eventType: event.eventType,
    aggregateId: event.appointmentId,
    payload: event,
    occurredAt: event.occurredAt,
    publishedAt: null,
  });
}


