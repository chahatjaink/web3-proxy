const prometheus = require("prom-client");

// Initialize the failed_count metric with a default value of 0
const failed_count = new prometheus.Gauge({
  name: "failed_count",
  help: "Failed request count by provider",
  labelNames: ["provider"],
});

// Export the metric so that it can be imported in other files
module.exports = { failed_count };
