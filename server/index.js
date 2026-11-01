//@ts-check
import { red, underline, bold } from "colorette";
import express from "express";
import { toNodeHandler } from "srvx/node";

import loudRejection from "loud-rejection";
import compression from "compression";
import morgan from "morgan";
import cron from "node-cron";
import bodyParser from "body-parser";

import "./env.js";

// Start index creation
import comicsIndex from "./comics.js";
import { registerRoutes } from "./routes/index.js";

const dev = process.env.NODE_ENV !== "production";

/**
 * Mount the TanStack Start application, must be registered after all other routes
 */
async function registerFrontend(server) {
  if (dev) {
    // The TanStack Start Vite plugin installs its own SSR middleware
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    server.use(vite.middlewares);
    return;
  }

  // Hashed assets never change, all other files are revalidated
  server.use(
    "/assets",
    express.static("dist/client/assets", { immutable: true, maxAge: "1y" })
  );
  server.use(express.static("dist/client", { index: false }));

  const { default: entry } = await import("../dist/server/server.mjs");
  server.use(toNodeHandler(entry.fetch));
}

loudRejection();

console.log(underline(bold("Starting server")));

cron.schedule(process.env.REFRESH_SCHEDULE, () => {
  comicsIndex.reindex().then(
    () => {
      console.log(underline(bold("Index ready ! Have a good read !")));
    },
    e => {
      console.error(red("Could not create index"), e);
    }
  );
});

const server = express();

server.use(compression()); // Enable Gzip
server.use(morgan("tiny")); // Access logs
server.use("/api", bodyParser.json()); // Parse JSON request body

registerRoutes(server);

registerFrontend(server)
  .then(() => {
    server.listen(process.env.SERVER_PORT, err => {
      if (err) throw err;
      console.log(`> Started server on ${process.env.SERVER_URL}`);
    });
  })
  .catch(e => {
    console.error("Failed to start", e);
    process.exit(1);
  });
