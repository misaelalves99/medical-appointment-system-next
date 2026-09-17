export const REMINDER_REQUESTED_EVENT = "appointment.reminder.requested.v1" as const;

export type ReminderRequestedEvent = {
  eventId: string;
  eventType: typeof REMINDER_REQUESTED_EVENT;
  occurredAt: string;
  appointmentId: string;
  scheduledFor: string;
};

type ReminderRequestedInput = {
  eventId: string;
  occurredAt: Date;
  appointmentId: string;
  scheduledFor: Date;
};

export function createReminderRequestedEvent(
  input: ReminderRequestedInput,
): ReminderRequestedEvent {
  return {
    eventId: input.eventId,
    eventType: REMINDER_REQUESTED_EVENT,
    occurredAt: input.occurredAt.toISOString(),
    appointmentId: input.appointmentId,
    scheduledFor: input.scheduledFor.toISOString(),
  };
}
