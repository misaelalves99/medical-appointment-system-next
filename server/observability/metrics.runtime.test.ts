import { AggregationTemporality, InMemoryMetricExporter, MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

describe("Stage06 local metric collection evidence", () => {
  it("collects and exports a bounded HTTP counter locally", async () => {
    const exporter = new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE);
    const reader = new PeriodicExportingMetricReader({ exporter, exportIntervalMillis: 60_000 });
    const provider = new MeterProvider({ readers: [reader] });
    const meter = provider.getMeter("medical-appointment-stage06-runtime-proof");
    const counter = meter.createCounter("http.server.requests");
    counter.add(1, { method: "POST", route: "/graphql", status: "401" });

    await reader.forceFlush();
    const metrics = exporter.getMetrics();
    expect(metrics.length).toBeGreaterThan(0);
    const points = metrics.flatMap((result) =>
      result.scopeMetrics.flatMap((scope) =>
        scope.metrics.filter((metric) => metric.descriptor.name === "http.server.requests")
      )
    );
    expect(points.length).toBeGreaterThan(0);
    expect(JSON.stringify(points)).toContain("/graphql");
    expect(JSON.stringify(points)).not.toContain("authorization");
    await provider.shutdown();
  });
});
