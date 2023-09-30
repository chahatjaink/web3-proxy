const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const process = require("process");
const app = express();
const { performHealthCheck } = require("./healthCheck/healthCheck");

app.use(bodyParser.json());

const { handleOptions } = require("./handlers/handleOption");
const { handlePost } = require("./handlers/handlePost");
const { handleGet } = require("./handlers/handleGet");
const {failed_count} = require("./utils/failedCountMetric");
const prometheus = require("prom-client");

failed_count.set({ provider: "default" }, 0);
// const { hostname, port } = require("./utils/config.js");
const hostname = "0.0.0.0";
const port = "3001";

app.use(bodyParser.json());

app.get("/health", async (req, res) => {
  try {
    const result = await performHealthCheck();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", prometheus.register.contentType);
    const metrics = await prometheus.register.metrics();
    res.send(metrics);
  } catch (error) {
    console.error("Error in /metrics route:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.get("/health", async (req, res) => {
  try {
    const result = await performHealthCheck();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use((req, res) => {
  if (req.method.toUpperCase() === "OPTIONS") {
    handleOptions(req, res);
  } else if (req.method.toUpperCase() === "POST") {
    handlePost(req, res);
  } else {
    handleGet(req, res);
  }
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Gracefully shutting down...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});