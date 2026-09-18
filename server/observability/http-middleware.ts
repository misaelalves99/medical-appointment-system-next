import type { NextFunction, Request, Response } from "express";
import { SpanStatusCode } from "@opentelemetry/api";
import { httpRequests, structuredLog, tracer } from "./index";
import type { Counter, Tracer } from "@opentelemetry/api";

function routeLabel(request: Request): string {
  if (request.path === "/graphql") return "/graphql";
  if (/^\/api\/appointments\/[^/]+\/status-stream$/.test(request.path)) {
    return "/api/appointments/:id/status-stream";
  }
  if (request.path.startsWith("/api/auth")) return "/api/auth";
  if (request.path.startsWith("/api/appointments")) return "/api/appointments";
  return "other";
}

type ObservabilityDeps = {
  tracer?: Tracer;
  httpRequests?: Counter;
  log?: typeof structuredLog;
};

export function createObservabilityMiddleware(deps: ObservabilityDeps = {}) {
  const activeTracer = deps.tracer ?? tracer;
  const activeHttpRequests = deps.httpRequests ?? httpRequests;
  const activeLog = deps.log ?? structuredLog;
  return (request: Request, response: Response, next: NextFunction) => {
    const started = process.hrtime.bigint();
    const route = routeLabel(request);
    const method = request.method;

    return activeTracer.startActiveSpan("http.request", { attributes: {
      "http.request.method": method,
      "http.route": route,
    }}, (span) => {
      response.once("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
        const status = response.statusCode;
        span.setAttribute("http.response.status_code", status);
        if (status >= 500) span.setStatus({ code: SpanStatusCode.ERROR });
        activeHttpRequests.add(1, { method, route, status: String(status) });
        activeLog("http.request.completed", {
          method, route, status, durationMs: Math.round(durationMs * 1000) / 1000,
        });
        span.end();
      });
      next();
    });
  };
}
