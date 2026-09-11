import type { AuthRepository } from "./repository";
import { hashPassword, verifyPassword } from "./password";
import { createOpaqueRefreshToken, hashRefreshToken } from "./refresh-token";
import { signAccessToken } from "./token";
import type { AuthRole, AuthUser } from "./types";

export class AuthError extends Error {
  constructor(
    public readonly code:
      | "EMAIL_IN_USE"
      | "INVALID_CREDENTIALS"
      | "INVALID_REFRESH_TOKEN",
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export interface AuthServiceOptions {
  accessTokenSecret: string;
  accessTokenTtlSeconds?: number;
  refreshTokenTtlMs?: number;
}

export function createAuthService(
  repository: AuthRepository,
  options: AuthServiceOptions,
) {
  const accessTokenTtlSeconds = options.accessTokenTtlSeconds ?? 900;
  const refreshTokenTtlMs = options.refreshTokenTtlMs ?? 7 * 24 * 60 * 60 * 1000;

  async function issueSession(user: AuthUser) {
    const accessToken = await signAccessToken(
      user,
      options.accessTokenSecret,
      accessTokenTtlSeconds,
    );
    const refreshToken = createOpaqueRefreshToken();
    await repository.createRefreshSession({
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshTokenTtlMs),
    });
    return { user, accessToken, refreshToken };
  }

  return {
    async register(input: {
      email: string;
      password: string;
      role: AuthRole;
      practitionerId?: string | null;
    }) {
      const email = input.email.trim().toLowerCase();
      if (await repository.findUserByEmail(email)) {
        throw new AuthError("EMAIL_IN_USE", "Email is already registered.");
      }
      const user = await repository.createUser({
        email,
        passwordHash: await hashPassword(input.password),
        role: input.role,
        practitionerId: input.practitionerId ?? null,
      });
      return issueSession(user);
    },

    async login(emailInput: string, password: string) {
      const email = emailInput.trim().toLowerCase();
      const user = await repository.findUserByEmail(email);
      if (!user || !(await verifyPassword(user.passwordHash, password))) {
        throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password.");
      }
      return issueSession(user);
    },

    async refresh(refreshToken: string) {
      const session = await repository.findActiveRefreshSession(
        hashRefreshToken(refreshToken),
      );
      if (!session) {
        throw new AuthError("INVALID_REFRESH_TOKEN", "Invalid refresh token.");
      }
      const user = await repository.findUserById(session.userId);
      if (!user) {
        throw new AuthError("INVALID_REFRESH_TOKEN", "Invalid refresh token.");
      }
      await repository.revokeRefreshSession(session.id);
      return issueSession(user);
    },

    async logout(refreshToken: string) {
      const session = await repository.findActiveRefreshSession(
        hashRefreshToken(refreshToken),
      );
      if (session) {
        await repository.revokeRefreshSession(session.id);
      }
    },
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
