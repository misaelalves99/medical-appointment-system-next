import type { AuthRole, AuthUser, RefreshSessionRecord } from "./types";

export interface CreateUserRecord {
  email: string;
  passwordHash: string;
  role: AuthRole;
  practitionerId: string | null;
}

export interface CreateRefreshSessionRecord {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface AuthRepository {
  findUserByEmail(email: string): Promise<(AuthUser & { passwordHash: string }) | null>;
  findUserById(id: string): Promise<AuthUser | null>;
  createUser(input: CreateUserRecord): Promise<AuthUser>;
  createRefreshSession(input: CreateRefreshSessionRecord): Promise<RefreshSessionRecord>;
  findActiveRefreshSession(tokenHash: string): Promise<RefreshSessionRecord | null>;
  revokeRefreshSession(id: string): Promise<void>;
}
