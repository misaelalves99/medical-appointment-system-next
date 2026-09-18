import { metrics, trace } from "@opentelemetry/api";

export const tracer = trace.getTracer("medical-appointment-http");
export const meter = metrics.getMeter("medical-appointment-http");
export const httpRequests = meter.createCounter("http.server.requests", {
  description: "Bounded first-party HTTP request count",
});

const allowedAttributeKeys = new Set([
  "method",
  "route",
  "status",
  "durationMs",
]);

export function safeAttributes(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) =>
        allowedAttributeKeys.has(key) &&
        (typeof value === "string" || typeof value === "number" || typeof value === "boolean"),
    ),
  );
}
export function structuredLog(event: string, attributes: Record<string, unknown> = {}) {
  process.stdout.write(`${JSON.stringify({ event, ...safeAttributes(attributes) })}\n`);
}
