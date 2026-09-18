import { processReminderEventIdempotently } from "../../services/reminder-service/src/queue/process-reminder-event-idempotently";

const event = {
 eventId:"evt-idempotency-001", eventType:"appointment.reminder.requested.v1" as const,
 occurredAt:"2026-09-18T00:00:00.000Z", appointmentId:"appt-idempotency-001",
 scheduledFor:"2026-09-18T01:00:00.000Z",
};

describe("processReminderEventIdempotently",()=>{
 it("processes a new event and records its eventId",async()=>{
  const handle=jest.fn(async()=>undefined), has=jest.fn(async()=>false), markProcessed=jest.fn(async()=>undefined);
  await expect(processReminderEventIdempotently(event,{handle},{has,markProcessed})).resolves.toBe("processed");
  expect(handle).toHaveBeenCalledTimes(1);expect(markProcessed).toHaveBeenCalledWith(event.eventId);
 });
 it("suppresses redelivery when eventId is already processed",async()=>{
  const handle=jest.fn(async()=>undefined), has=jest.fn(async()=>true), markProcessed=jest.fn(async()=>undefined);
  await expect(processReminderEventIdempotently(event,{handle},{has,markProcessed})).resolves.toBe("duplicate");
  expect(handle).not.toHaveBeenCalled();expect(markProcessed).not.toHaveBeenCalled();
 });
 it("does not mark processed when the handler fails",async()=>{
  const handle=jest.fn(async()=>{throw new Error("synthetic failure")}), has=jest.fn(async()=>false), markProcessed=jest.fn(async()=>undefined);
  await expect(processReminderEventIdempotently(event,{handle},{has,markProcessed})).rejects.toThrow("synthetic failure");
  expect(markProcessed).not.toHaveBeenCalled();
 });
});
