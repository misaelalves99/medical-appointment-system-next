import { SendMessageCommand, type SQSClient } from "@aws-sdk/client-sqs";
import type { SqsSendInput, SqsSender } from "./sqs-reminder-queue-adapter";

export class AwsSdkSqsSender implements SqsSender {
  constructor(private readonly client: Pick<SQSClient, "send">) {}

  async send(input: SqsSendInput): Promise<{ MessageId?: string }> {
    const output = await this.client.send(new SendMessageCommand(input));
    return { MessageId: output.MessageId };
  }
}