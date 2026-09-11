import { and, eq, gt, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { refreshSessions, users } from "../db/schema";
import type {
  AuthRepository,
  CreateRefreshSessionRecord,
  CreateUserRecord,
} from "./repository";
import type { AuthRole, AuthUser, RefreshSessionRecord } from "./types";

function toUser(row: typeof users.$inferSelect): AuthUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role as AuthRole,
    practitionerId: row.practitionerId,
  };
}

export class PostgresAuthRepository implements AuthRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findUserByEmail(
    email: string,
  ): Promise<(AuthUser & { passwordHash: string }) | null> {
    const [row] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return row ? { ...toUser(row), passwordHash: row.passwordHash } : null;
  }

  async findUserById(id: string): Promise<AuthUser | null> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return row ? toUser(row) : null;
  }

  async createUser(input: CreateUserRecord): Promise<AuthUser> {
    const [row] = await this.db.insert(users).values(input).returning();
    return toUser(row);
  }

  async createRefreshSession(
    input: CreateRefreshSessionRecord,
  ): Promise<RefreshSessionRecord> {
    const [row] = await this.db.insert(refreshSessions).values(input).returning();
    return row;
  }

  async findActiveRefreshSession(
    tokenHash: string,
  ): Promise<RefreshSessionRecord | null> {
    const [row] = await this.db
      .select()
      .from(refreshSessions)
      .where(
        and(
          eq(refreshSessions.tokenHash, tokenHash),
          isNull(refreshSessions.revokedAt),
          gt(refreshSessions.expiresAt, new Date()),
        ),
      )
      .limit(1);
    return row ?? null;
  }

  async revokeRefreshSession(id: string): Promise<void> {
    await this.db
      .update(refreshSessions)
      .set({ revokedAt: new Date() })
      .where(eq(refreshSessions.id, id));
  }
}
