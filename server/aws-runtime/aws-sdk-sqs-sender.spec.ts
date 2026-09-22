jest.mock("@aws-sdk/client-sqs", () => {
  class SendMessageCommand {
    input: unknown;
    constructor(input: unknown) {
      this.input = input;
    }
  }
  return { SendMessageCommand };
});

import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { AwsSdkSqsSender } from "./aws-sdk-sqs-sender";

describe("AwsSdkSqsSender", () => {
  it("constructs SendMessageCommand and delegates to an injected local client", async () => {
    const seen: unknown[] = [];
    const client = {
      send: async (command: unknown) => {
        seen.push(command);
        return { MessageId: "msg-sdk-local-001" };
      },
    };
    const sender = new AwsSdkSqsSender(client as never);
    const input = {
      QueueUrl: "https://sqs.local.invalid/123/reminders.fifo",
      MessageBody: '{"synthetic":true}',
      MessageGroupId: "appt-synthetic-001",
      MessageDeduplicationId: "evt-synthetic-001",
    };
    await expect(sender.send(input)).resolves.toEqual({ MessageId: "msg-sdk-local-001" });
    expect(seen).toHaveLength(1);
    expect(seen[0]).toBeInstanceOf(SendMessageCommand);
    expect((seen[0] as unknown as { input: unknown }).input).toEqual(input);
  });

  it("propagates SDK client failure without swallowing retry semantics", async () => {
    const client = { send: async () => { throw new Error("synthetic-sdk-failure"); } };
    const sender = new AwsSdkSqsSender(client as never);
    await expect(sender.send({
      QueueUrl: "https://sqs.local.invalid/123/reminders.fifo",
      MessageBody: "{}",
    })).rejects.toThrow("synthetic-sdk-failure");
  });
});