export const APPOINTMENT_REMINDER_REQUESTED_V1 = "appointment.reminder.requested.v1" as const;

export type AppointmentReminderRequestedV1 = {
  eventId: string;
  eventType: typeof APPOINTMENT_REMINDER_REQUESTED_V1;
  occurredAt: string;
  appointmentId: string;
  scheduledFor: string;
};

export function isAppointmentReminderRequestedV1(value: unknown): value is AppointmentReminderRequestedV1 {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return e.eventType === APPOINTMENT_REMINDER_REQUESTED_V1 &&
    typeof e.eventId === "string" && e.eventId.length > 0 &&
    typeof e.occurredAt === "string" && e.occurredAt.length > 0 &&
    typeof e.appointmentId === "string" && e.appointmentId.length > 0 &&
    typeof e.scheduledFor === "string" && e.scheduledFor.length > 0;
}

export function assertAppointmentReminderRequestedV1(value: unknown): AppointmentReminderRequestedV1 {
  if (!isAppointmentReminderRequestedV1(value)) {
    throw new Error("Invalid appointment.reminder.requested.v1 integration event");
  }
  return value;
}
