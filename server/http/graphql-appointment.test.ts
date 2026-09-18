/** @jest-environment node */
import { getNamedType } from "graphql";
import type { NextFunction, Request, Response } from "express";
import { createAppointmentGraphqlHandler, appointmentGraphqlSchema } from "./graphql-appointment";
import type { AuthenticatedRequest } from "../auth/middleware";

const ownerId = "11111111-1111-4111-8111-111111111111";
const appointment = {
  id: "appointment-demo-graphql-001",
  patientId: ownerId,
  practitionerId: "practitioner-demo-001",
  ownerUserId: ownerId,
  startAt: "2030-01-02T10:00:00.000Z",
  endAt: "2030-01-02T10:30:00.000Z",
  reason: "Synthetic GraphQL proof",
};

function responseDouble() {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  (response.status as jest.Mock).mockReturnValue(response);
  return response;
}

describe("appointment GraphQL read-only adapter", () => {
  it("has no mutation root type", () => {
    expect(appointmentGraphqlSchema.getMutationType()).toBeUndefined();
    expect(getNamedType(appointmentGraphqlSchema.getQueryType()!)).toBeDefined();
  });

  it("returns 401 without an authenticated principal", async () => {
    const readPort = { findByIdForPrincipal: jest.fn() };
    const handler = createAppointmentGraphqlHandler(readPort);
    const request = { body: { query: "{ appointment(id: \"a\") { id } }" } } as Request;
    const response = responseDouble();
    await handler(request, response, jest.fn() as NextFunction);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(readPort.findByIdForPrincipal).not.toHaveBeenCalled();
  });

  it("queries through the authenticated owner-scoped read port", async () => {
    const readPort = { findByIdForPrincipal: jest.fn().mockResolvedValue(appointment) };
    const handler = createAppointmentGraphqlHandler(readPort);
    const request = {
      body: { query: "query($id: ID!) { appointment(id: $id) { id ownerUserId } }", variables: { id: appointment.id } },
      auth: { sub: ownerId, role: "PATIENT", practitionerId: null },
    } as unknown as AuthenticatedRequest;
    const response = responseDouble();
    await handler(request, response, jest.fn() as NextFunction);
    expect(readPort.findByIdForPrincipal).toHaveBeenCalledWith(appointment.id, ownerId);
    expect(response.json).toHaveBeenCalledWith({ data: { appointment: { id: appointment.id, ownerUserId: ownerId } } });
  });

  it("returns null when the owner-scoped read port denies visibility", async () => {
    const readPort = { findByIdForPrincipal: jest.fn().mockResolvedValue(null) };
    const handler = createAppointmentGraphqlHandler(readPort);
    const request = {
      body: { query: "{ appointment(id: \"hidden\") { id } }" },
      auth: { sub: "different-principal", role: "PATIENT", practitionerId: null },
    } as unknown as AuthenticatedRequest;
    const response = responseDouble();
    await handler(request, response, jest.fn() as NextFunction);
    expect(response.json).toHaveBeenCalledWith({ data: { appointment: null } });
  });
});
