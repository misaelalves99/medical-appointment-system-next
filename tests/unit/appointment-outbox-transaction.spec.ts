import { persistAppointmentWithOutbox } from "../../server/application/persist-appointment-with-outbox";

describe("persistAppointmentWithOutbox", () => {
  it("persists appointment and outbox event through one transaction boundary", async () => {
    const calls: string[] = [];

    type FakeTransaction = {
      insertAppointment(): Promise<void>;
      insertOutboxEvent(): Promise<void>;
    };

    const tx: FakeTransaction = {
      insertAppointment: async () => { calls.push("appointment"); },
      insertOutboxEvent: async () => { calls.push("outbox"); },
    };

    const database = {
      transaction: async (work: (transaction: FakeTransaction) => Promise<void>) => {
        calls.push("begin");
        await work(tx);
        calls.push("commit");
      },
    };

    await persistAppointmentWithOutbox(database, {
      appointment: { id: "appt-1" },
      event: { id: "evt-1", eventType: "appointment.reminder.requested.v1" },
    });

    expect(calls).toEqual(["begin", "appointment", "outbox", "commit"]);
  });
});
