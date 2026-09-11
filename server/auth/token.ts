import { SignJWT, jwtVerify } from "jose";
import type { AuthPrincipal, AuthUser } from "./types";

const encoder = new TextEncoder();

export async function signAccessToken(
  user: AuthUser,
  secret: string,
  ttlSeconds = 900,
): Promise<string> {
  return new SignJWT({
    role: user.role,
    practitionerId: user.practitionerId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttlSeconds)
    .sign(encoder.encode(secret));
}

export async function verifyAccessToken(
  token: string,
  secret: string,
): Promise<AuthPrincipal> {
  const { payload } = await jwtVerify(token, encoder.encode(secret), {
    algorithms: ["HS256"],
  });

  if (
    !payload.sub ||
    (payload.role !== "PATIENT" &&
      payload.role !== "PRACTITIONER" &&
      payload.role !== "ADMIN")
  ) {
    throw new Error("Invalid access token claims.");
  }

  return {
    sub: payload.sub,
    role: payload.role,
    practitionerId:
      typeof payload.practitionerId === "string" ? payload.practitionerId : null,
  };
}
