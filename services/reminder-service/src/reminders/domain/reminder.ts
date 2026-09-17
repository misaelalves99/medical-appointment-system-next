export type ReminderStatus = "pending" | "scheduled";

export interface Reminder {
  appointmentId: string;
  scheduledFor: Date;
  status: ReminderStatus;
}
