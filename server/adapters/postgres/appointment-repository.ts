import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  AppointmentDto,
  CreateAppointmentInput,
} from "../../contracts/appointment";
import { appointments } from "../../db/schema";
import type { AppointmentRepository } from "../../ports/appointment-repository";

interface ErrorLike {
  code?: string;
  cause?: unknown;
}

function getErrorCode(error: unknown): string | undefined {
  const visited = new Set<unknown>();
  let current: unknown = error;

  while (typeof current === "object" && current !== null && !visited.has(current)) {
    visited.add(current);
    const candidate = current as ErrorLike;

    if (typeof candidate.code === "string") {
      return candidate.code;
    }

    current = candidate.cause;
  }

  return undefined;
}

function isExclusionViolation(error: unknown): boolean {
  return getErrorCode(error) === "23P01";
}

function toDto(row: typeof appointments.$inferSelect): AppointmentDto {
  return {
    id: row.id,
    patientId: row.patientId,
    practitionerId: row.practitionerId,
    startAt: row.startAt.toISOString(),
    endAt: row.endAt.toISOString(),
    ...(row.reason ? { reason: row.reason } : {}),
  };
}

export class PostgresAppointmentRepository implements AppointmentRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async createIfNoOverlap(
    input: CreateAppointmentInput,
  ): Promise<AppointmentDto | null> {
    try {
      const rows = await this.db
        .insert(appointments)
        .values({
          patientId: input.patientId,
          practitionerId: input.practitionerId,
          startAt: new Date(input.startAt),
          endAt: new Date(input.endAt),
          reason: input.reason,
        })
        .returning();

      const created = rows[0];
      if (!created) {
        throw new Error("PostgreSQL insert returned no appointment row.");
      }

      return toDto(created);
    } catch (error) {
      if (isExclusionViolation(error)) {
        return null;
      }
      throw error;
    }
  }
}
