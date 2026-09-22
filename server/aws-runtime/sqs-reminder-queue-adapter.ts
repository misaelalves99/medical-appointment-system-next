import type { QueueSendResult, ReminderEventV1, ReminderQueuePort } from "./reminder-queue-port";

export type SqsSendInput = {
  QueueUrl: string;
  MessageBody: string;
  MessageGroupId?: string;
  MessageDeduplicationId?: string;
};

export interface SqsSender {
  send(input: SqsSendInput): Promise<{ MessageId?: string }>;
}

export class BoundedSqsReminderQueueAdapter implements ReminderQueuePort {
  constructor(
    private readonly sender: SqsSender,
    private readonly queueUrl: string,
  ) {
    if (!queueUrl) throw new Error("SQS queue URL is required");
  }

  async send(event: ReminderEventV1): Promise<QueueSendResult> {
    if (event.eventType !== "appointment-reminder-requested-v1") {
      throw new Error("Unsupported reminder event");
    }
    if (!event.eventId || !event.appointmentId || !event.ownerId) {
      throw new Error("Invalid reminder event identity");
    }

    const result = await this.sender.send({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(event),
      MessageDeduplicationId: event.eventId,
      MessageGroupId: event.appointmentId,
    });
    return { messageId: result.MessageId };
  }
}