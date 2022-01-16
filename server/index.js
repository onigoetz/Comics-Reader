//@ts-check
import next from "next";
import chalk from "chalk";
import express from "express";

import loudRejection from "loud-rejection";
import compression from "compression";
import morgan from "morgan";
import cron from "node-cron";

import "./env.mjs";

// Kickstart index creation
import comicsIndex from "./comics.js";

import { imagecache } from "./api/imagecache.js";

const title = chalk.underline.bold;
const error = chalk.red;

const app = next({
  dev: process.env.NODE_ENV !== "production",
  dir: process.cwd()
});
const handle = app.getRequestHandler();

loudRejection();

console.log(title("Starting server"));

cron.schedule(process.env.REFRESH_SCHEDULE, () => {
  comicsIndex.reindex().then(  () => {
    console.log(title("Index ready ! Have a good read !"));
  },
  e => {
    console.error(error("Could not create index"), e);
  });
});

app.prepare().then(() => {
  const server = express();

  server.use(compression()); // Enable Gzip
  server.use(morgan("tiny")); // Access logs

  // Static assets
  server.use("/images", express.static("images"));
  server.get(/\/images\/cache\/([a-zA-Z]*)\/(.*)/, imagecache);

  server.all("*", (req, res) => {
    handle(req, res);
  });

  server.listen(process.env.SERVER_PORT);

  console.log(title(`Started server on ${process.env.SERVER_URL}`));
}).catch(e => {
  console.error("Failed to start", e);
  process.exit(1);
});
