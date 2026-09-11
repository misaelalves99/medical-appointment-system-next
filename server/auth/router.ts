import { Router } from "express";
import { z, ZodError } from "zod";
import type { AuthService } from "./service";
import { AuthError } from "./service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
  role: z.enum(["PATIENT", "PRACTITIONER", "ADMIN"]),
  practitionerId: z.string().trim().min(1).nullable().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(32),
});

function authErrorStatus(error: AuthError): number {
  if (error.code === "EMAIL_IN_USE") return 409;
  return 401;
}

export function authRouter(service: AuthService): Router {
  const router = Router();

  router.post("/register", async (request, response) => {
    try {
      const input = registerSchema.parse(request.body);
      const session = await service.register(input);
      response.status(201).json({ data: session });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: { code: "VALIDATION_ERROR", message: "Invalid registration input." },
        });
        return;
      }
      if (error instanceof AuthError) {
        response.status(authErrorStatus(error)).json({
          error: { code: error.code, message: error.message },
        });
        return;
      }
      response.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Unexpected server error." },
      });
    }
  });

  router.post("/login", async (request, response) => {
    try {
      const input = loginSchema.parse(request.body);
      const session = await service.login(input.email, input.password);
      response.status(200).json({ data: session });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: { code: "VALIDATION_ERROR", message: "Invalid login input." },
        });
        return;
      }
      if (error instanceof AuthError) {
        response.status(401).json({
          error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." },
        });
        return;
      }
      response.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Unexpected server error." },
      });
    }
  });

  router.post("/refresh", async (request, response) => {
    try {
      const input = refreshSchema.parse(request.body);
      response.status(200).json({ data: await service.refresh(input.refreshToken) });
    } catch (error) {
      if (error instanceof ZodError || error instanceof AuthError) {
        response.status(401).json({
          error: { code: "INVALID_REFRESH_TOKEN", message: "Invalid refresh token." },
        });
        return;
      }
      response.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Unexpected server error." },
      });
    }
  });

  router.post("/logout", async (request, response) => {
    try {
      const input = refreshSchema.parse(request.body);
      await service.logout(input.refreshToken);
      response.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: { code: "VALIDATION_ERROR", message: "Invalid logout input." },
        });
        return;
      }
      response.status(500).json({
        error: { code: "INTERNAL_ERROR", message: "Unexpected server error." },
      });
    }
  });

  return router;
}
