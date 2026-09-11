import { Router, type Response } from "express";
import { z, ZodError } from "zod";
import type { AuthService } from "./service";
import { AuthError } from "./service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
  role: z.literal("PATIENT").optional(),
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const refreshCookieName = "medappt_refresh";
const refreshCookieOptions = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/api/auth" };

function authErrorStatus(error: AuthError): number {
  return error.code === "EMAIL_IN_USE" ? 409 : 401;
}

function readCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) return decodeURIComponent(part.slice(separator + 1).trim());
  }
  return null;
}

function publicSession<T extends { refreshToken: string }>(session: T) {
  const { refreshToken, ...safe } = session;
  void refreshToken;
  return safe;
}

function setRefreshCookie(response: Response, token: string) {
  response.cookie(refreshCookieName, token, refreshCookieOptions);
}

export function authRouter(service: AuthService): Router {
  const router = Router();

  router.post("/register", async (request, response) => {
    try {
      const input = registerSchema.parse(request.body);
      const session = await service.register({
        email: input.email, password: input.password, role: "PATIENT", practitionerId: null,
      });
      setRefreshCookie(response, session.refreshToken);
      response.status(201).json({ data: publicSession(session) });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid registration input." } });
        return;
      }
      if (error instanceof AuthError) {
        response.status(authErrorStatus(error)).json({ error: { code: error.code, message: error.message } });
        return;
      }
      response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error." } });
    }
  });

  router.post("/login", async (request, response) => {
    try {
      const input = loginSchema.parse(request.body);
      const session = await service.login(input.email, input.password);
      setRefreshCookie(response, session.refreshToken);
      response.status(200).json({ data: publicSession(session) });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid login input." } });
        return;
      }
      if (error instanceof AuthError) {
        response.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } });
        return;
      }
      response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error." } });
    }
  });

  router.post("/refresh", async (request, response) => {
    try {
      const refreshToken = readCookie(request.headers.cookie, refreshCookieName);
      if (!refreshToken) {
        response.status(401).json({ error: { code: "INVALID_REFRESH_TOKEN", message: "Invalid refresh token." } });
        return;
      }
      const session = await service.refresh(refreshToken);
      setRefreshCookie(response, session.refreshToken);
      response.status(200).json({ data: publicSession(session) });
    } catch (error) {
      if (error instanceof AuthError) {
        response.status(401).json({ error: { code: "INVALID_REFRESH_TOKEN", message: "Invalid refresh token." } });
        return;
      }
      response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error." } });
    }
  });

  router.post("/logout", async (request, response) => {
    try {
      const refreshToken = readCookie(request.headers.cookie, refreshCookieName);
      if (refreshToken) await service.logout(refreshToken);
      response.clearCookie(refreshCookieName, refreshCookieOptions);
      response.status(204).send();
    } catch {
      response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected server error." } });
    }
  });

  return router;
}
