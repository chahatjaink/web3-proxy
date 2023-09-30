/*instrumentation.js*/
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");
const {
    PeriodicExportingMetricReader,
    ConsoleMetricExporter,
} = require("@opentelemetry/sdk-metrics");
const { Resource } = require("@opentelemetry/resources");
const {
    SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");

// Create a Prometheus exporter configuration
const prometheusExporter = new PrometheusExporter({
    startServer: true,
    port: 9464,
});

const sdk = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "web3-proxy",
        [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
    }),
    traceExporter: new ConsoleSpanExporter(),
    metricExporter: prometheusExporter,
    metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
    }),
});

console.log("Prometheus metrics server is running on port 9464");
sdk.start();
