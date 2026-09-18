import { buildSchema, graphql } from "graphql";
import type { RequestHandler } from "express";
import type { AuthenticatedRequest } from "../auth/middleware";
import type { AppointmentDto } from "../contracts/appointment";

export interface AppointmentReadPort {
  findByIdForPrincipal(id: string, principalId: string): Promise<AppointmentDto | null>;
}

export const appointmentGraphqlSchema = buildSchema(`
  type Appointment {
    id: ID!
    patientId: String!
    practitionerId: String!
    ownerUserId: String
    startAt: String!
    endAt: String!
    reason: String
  }

  type Query {
    appointment(id: ID!): Appointment
  }
`);

export function createAppointmentGraphqlHandler(readPort: AppointmentReadPort): RequestHandler {
  return async (request, response) => {
    const principal = (request as AuthenticatedRequest).auth;
    if (!principal) {
      response.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication required." } });
      return;
    }

    const source = typeof request.body?.query === "string" ? request.body.query : "";
    const variableValues =
      request.body?.variables && typeof request.body.variables === "object" ? request.body.variables : undefined;

    const result = await graphql({
      schema: appointmentGraphqlSchema,
      source,
      variableValues,
      rootValue: {
        appointment: ({ id }: { id: string }) => readPort.findByIdForPrincipal(id, principal.sub),
      },
    });

    response.status(200).json(result);
  };
}
