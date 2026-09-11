export type AuthRole = "PATIENT" | "PRACTITIONER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
  practitionerId: string | null;
}

export interface AuthPrincipal {
  sub: string;
  role: AuthRole;
  practitionerId: string | null;
}

export interface RefreshSessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}
