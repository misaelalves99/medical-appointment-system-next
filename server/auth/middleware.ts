import type { NextFunction, Request, RequestHandler, Response } from "express";
import { verifyAccessToken } from "./token";
import type { AuthPrincipal } from "./types";

export type AuthenticatedRequest = Request & { auth?: AuthPrincipal };

export function createRequireAuth(accessTokenSecret: string): RequestHandler {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authorization = request.header("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      response.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required." },
      });
      return;
    }

    try {
      const principal = await verifyAccessToken(
        authorization.slice("Bearer ".length),
        accessTokenSecret,
      );
      (request as AuthenticatedRequest).auth = principal;
      next();
    } catch {
      response.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required." },
      });
    }
  };
}
