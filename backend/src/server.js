import cors from "cors";
import express from "express";
import { counties, featuredTowns, highways } from "./data/kenyaDirectory.js";

const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());

const landingData = { counties, featuredTowns, highways };

app.get("/", (_request, response) => {
  response.json({
    name: "YEK backend API",
    status: "running",
    endpoints: ["/api/health", "/api/landing", "/api/counties", "/api/highways"]
  });
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/landing", (_request, response) => {
  response.json(landingData);
});

app.get("/api/counties", (_request, response) => {
  response.json(counties);
});

app.get("/api/highways", (_request, response) => {
  response.json(highways);
});

const server = app.listen(port, host, () => {
  console.log(`YEK backend listening on http://${host}:${port}`);
});

server.on("error", async (error) => {
  if (error.code !== "EADDRINUSE") {
    throw error;
  }

  try {
    const response = await fetch(`http://${host}:${port}/api/health`);
    if (response.ok) {
      console.log(`YEK backend is already running on http://${host}:${port}`);
      process.exit(0);
    }
  } catch {
    // Another service may be using the port.
  }

  console.error(`Port ${port} is already in use. Set PORT to another value or stop the process using it.`);
  process.exit(1);
});
