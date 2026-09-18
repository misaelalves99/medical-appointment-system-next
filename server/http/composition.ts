import type { Express } from "express";
import { PostgresAppointmentRepository } from "../adapters/postgres/appointment-repository";
import { createAppointmentService } from "../application/create-appointment";
import { PostgresAuthRepository } from "../auth/postgres-auth-repository";
import { authRouter } from "../auth/router";
import { createAuthService } from "../auth/service";
import { createRequireAuth } from "../auth/middleware";
import { createPostgresClient } from "../db/client";
import { createHttpApp } from "./app";

export interface HttpCompositionOptions {
  databaseUrl: string;
  accessTokenSecret: string;
}

export interface HttpComposition {
  app: Express;
  close(): Promise<void>;
}

export function createFirstPartyHttpComposition(options: HttpCompositionOptions): HttpComposition {
  const { db, pool } = createPostgresClient(options.databaseUrl);
  const appointmentRepository = new PostgresAppointmentRepository(db);
  const authRepository = new PostgresAuthRepository(db);
  const authService = createAuthService(authRepository, {
    accessTokenSecret: options.accessTokenSecret,
  });

  const app = createHttpApp(createAppointmentService(appointmentRepository), {
    router: authRouter(authService),
    requireAuth: createRequireAuth(options.accessTokenSecret),
    appointmentReadPort: appointmentRepository,
  });

  return {
    app,
    close: () => pool.end(),
  };
}
