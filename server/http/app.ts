import { createObservabilityMiddleware } from "../observability/http-middleware";
import express, { Router, type Express, type RequestHandler } from "express";
import type { createAppointmentService } from "../application/create-appointment";
import { createAppointmentGraphqlHandler, type AppointmentReadPort } from "./graphql-appointment";
import { appointmentsRouter } from "./appointments-router";
import { createAppointmentStatusStreamHandler } from "./appointment-status-stream";

type CreateAppointmentHandler = ReturnType<typeof createAppointmentService>;

const denyUnauthenticated: RequestHandler = (_request, response) => {
  response.status(401).json({
    error: { code: "UNAUTHORIZED", message: "Authentication required." },
  });
};

export interface HttpAuthDependencies {
  router?: Router;
  requireAuth?: RequestHandler;
  appointmentReadPort?: AppointmentReadPort;
}

export function createHttpApp(
  createAppointment: CreateAppointmentHandler,
  auth: HttpAuthDependencies = {},
  observabilityMiddleware = createObservabilityMiddleware(),
): Express {
  const app = express();

  app.use(observabilityMiddleware);

  app.use(express.json());
  if (auth.router) {
    app.use("/api/auth", auth.router);
  }
  if (auth.appointmentReadPort) {
    app.get(
      "/api/appointments/:id/status-stream",
      auth.requireAuth ?? denyUnauthenticated,
      createAppointmentStatusStreamHandler(auth.appointmentReadPort),
    );
    app.post(
      "/graphql",
      auth.requireAuth ?? denyUnauthenticated,
      createAppointmentGraphqlHandler(auth.appointmentReadPort),
    );
  }
  app.use(
    "/api/appointments",
    appointmentsRouter(createAppointment, auth.requireAuth ?? denyUnauthenticated),
  );

  return app;
}
