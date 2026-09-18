import { TextDecoder, TextEncoder } from "util";
Object.assign(globalThis, { TextDecoder, TextEncoder });
import request from "supertest";
import { AggregationTemporality, InMemoryMetricExporter, MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { InMemorySpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { BasicTracerProvider } from "@opentelemetry/sdk-trace-base";
import { createHttpApp } from "../http/app";
import { createObservabilityMiddleware } from "./http-middleware";
import { createAppointmentService } from "../application/create-appointment";

describe("bounded HTTP observability runtime", () => {
  test("emits redacted structured log and HTTP response without exposing request body", async () => {
    const repository = { createIfNoOverlap: jest.fn(), create: jest.fn(), findByIdForPrincipal: jest.fn() };
    const write = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    const app = createHttpApp(createAppointmentService(repository), { appointmentReadPort: repository });
    await request(app).post("/graphql").send({ query: "{ appointment(id: \"secret-body\") { id } }" }).expect(401);
    const lines = write.mock.calls.map((call) => String(call[0])).join("");
    expect(lines).toContain('"event":"http.request.completed"');
    expect(lines).toContain('"route":"/graphql"');
    expect(lines).not.toContain("secret-body");
    expect(lines.toLowerCase()).not.toContain("authorization");
    write.mockRestore();
  });

  test("uses OpenTelemetry tracer primitives at runtime", () => {
    const exporter = new InMemorySpanExporter();
    const provider = new BasicTracerProvider({ spanProcessors: [new SimpleSpanProcessor(exporter)] });
    const tracer = provider.getTracer("stage06-runtime-proof");
    tracer.startSpan("proof").end();
    expect(exporter.getFinishedSpans().map((span) => span.name)).toContain("proof");
    provider.shutdown();
  });
});

test("emits trace metric and structured log from the same bounded HTTP request", async () => {
  const spanExporter = new InMemorySpanExporter();
  const traceProvider = new BasicTracerProvider({ spanProcessors: [new SimpleSpanProcessor(spanExporter)] });
  const localTracer = traceProvider.getTracer("stage06-same-flow");

  const metricExporter = new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE);
  const metricReader = new PeriodicExportingMetricReader({ exporter: metricExporter, exportIntervalMillis: 60_000 });
  const meterProvider = new MeterProvider({ readers: [metricReader] });
  const counter = meterProvider.getMeter("stage06-same-flow").createCounter("http.server.requests");

  const logs: Array<{ event: string; attributes: Record<string, unknown> }> = [];
  const middleware = createObservabilityMiddleware({
    tracer: localTracer,
    httpRequests: counter,
    log: (event, attributes = {}) => { logs.push({ event, attributes }); },
  });

  const repository = {
    create: jest.fn(),
    createIfNoOverlap: jest.fn(),
    findByIdForPrincipal: jest.fn(),
  };
  const app = createHttpApp(
    createAppointmentService(repository),
    { appointmentReadPort: repository },
    middleware,
  );

  await request(app)
    .post("/graphql")
    .set("Authorization", "Bearer stage06-secret")
    .send({ query: "{ appointment(id: \"secret-body\") { id } }" })
    .expect(401);

  await traceProvider.forceFlush();
  await meterProvider.forceFlush();

  const spans = spanExporter.getFinishedSpans();
  expect(spans.some((span) => span.name === "http.request" && span.attributes["http.route"] === "/graphql")).toBe(true);

  const metrics = metricExporter.getMetrics();
  const httpMetric = metrics.flatMap((result) => result.scopeMetrics)
    .flatMap((scope) => scope.metrics)
    .find((metric) => metric.descriptor.name === "http.server.requests");
  expect(httpMetric).toBeDefined();

  expect(logs.some(({ event, attributes }) =>
    event === "http.request.completed" &&
    attributes.route === "/graphql" &&
    attributes.method === "POST" &&
    attributes.status === 401
  )).toBe(true);

  const evidence = JSON.stringify({
    spans: spans.map((span) => ({ name: span.name, attributes: span.attributes })),
    metrics: metrics.flatMap((result) => result.scopeMetrics).flatMap((scope) =>
      scope.metrics.map((metric) => ({
        name: metric.descriptor.name,
        dataPoints: metric.dataPoints.map((point) => ({ attributes: point.attributes })),
      })),
    ),
    logs,
  });
  expect(evidence).not.toContain("stage06-secret");
  expect(evidence).not.toContain("secret-body");

  await traceProvider.shutdown();
  await meterProvider.shutdown();
});
