export type ReminderEventV1 = {
  eventId: string;
  eventType: "appointment-reminder-requested-v1";
  occurredAt: string;
  appointmentId: string;
  ownerId: string;
};

export type QueueSendResult = { messageId?: string };

export interface ReminderQueuePort {
  send(event: ReminderEventV1): Promise<QueueSendResult>;
}