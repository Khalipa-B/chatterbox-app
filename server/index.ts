import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes-simple.js";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = createServer(app);

// Register API routes first, before static file serving
registerRoutes(app, server);

if (process.env.NODE_ENV === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  log(`Server is running on port ${PORT}`);
});