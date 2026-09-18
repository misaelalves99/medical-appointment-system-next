/** @jest-environment node */
import { EventEmitter } from "events";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../auth/middleware";
import { createAppointmentStatusStreamHandler } from "./appointment-status-stream";

const ownerId = "11111111-1111-4111-8111-111111111111";
const appointment = {
  id: "appointment-sse-001",
  patientId: ownerId,
  practitionerId: "practitioner-demo-001",
  ownerUserId: ownerId,
  startAt: "2030-01-02T10:00:00.000Z",
  endAt: "2030-01-02T10:30:00.000Z",
  reason: "Synthetic SSE proof",
};

function responseDouble() {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
  } as unknown as Response;
  (response.status as jest.Mock).mockReturnValue(response);
  return response;
}
function requestDouble(auth = true, id = appointment.id) {
  const emitter = new EventEmitter() as EventEmitter & Partial<AuthenticatedRequest>;
  emitter.params = { id };
  if (auth) emitter.auth = { sub: ownerId, role: "PATIENT", practitionerId: null };
  return emitter as unknown as Request;
}

describe("appointment SSE status stream handler", () => {
  afterEach(() => jest.useRealTimers());

  it("returns 401 before repository access when unauthenticated", async () => {
    const readPort = { findByIdForPrincipal: jest.fn() };
    const response = responseDouble();
    await createAppointmentStatusStreamHandler(readPort)(requestDouble(false), response, jest.fn());
    expect(response.status).toHaveBeenCalledWith(401);
    expect(readPort.findByIdForPrincipal).not.toHaveBeenCalled();
  });

  it("returns 404 without opening a stream when owner-scoped read denies visibility", async () => {
    const readPort = { findByIdForPrincipal: jest.fn().mockResolvedValue(null) };
    const response = responseDouble();
    await createAppointmentStatusStreamHandler(readPort)(requestDouble(), response, jest.fn());
    expect(readPort.findByIdForPrincipal).toHaveBeenCalledWith(appointment.id, ownerId);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.flushHeaders).not.toHaveBeenCalled();
  });

  it("opens SSE, writes owner-visible snapshot and heartbeat, then cleans up on disconnect", async () => {
    jest.useFakeTimers();
    const readPort = { findByIdForPrincipal: jest.fn().mockResolvedValue(appointment) };
    const request = requestDouble();
    const response = responseDouble();
    await createAppointmentStatusStreamHandler(readPort, 1000)(request, response, jest.fn());
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.setHeader).toHaveBeenCalledWith("Content-Type", "text/event-stream");
    expect(response.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache");
    expect(response.setHeader).toHaveBeenCalledWith("Connection", "keep-alive");
    expect(response.flushHeaders).toHaveBeenCalled();
    expect(response.write).toHaveBeenCalledWith(expect.stringContaining("event: snapshot"));
    expect(response.write).toHaveBeenCalledWith(expect.stringContaining(appointment.id));
    jest.advanceTimersByTime(1000);
    expect(response.write).toHaveBeenCalledWith(": heartbeat\n\n");
    (request as unknown as EventEmitter).emit("close");
    expect(response.end).toHaveBeenCalledTimes(1);
    const writesAfterClose = (response.write as jest.Mock).mock.calls.length;
    jest.advanceTimersByTime(2000);
    expect((response.write as jest.Mock).mock.calls.length).toBe(writesAfterClose);
  });
});
