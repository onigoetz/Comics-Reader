//@ts-check
import next from "next";
import { red, underline, bold } from "colorette";
import express from "express";

import loudRejection from "loud-rejection";
import compression from "compression";
import morgan from "morgan";
import cron from "node-cron";

import "./env.js";

import { imagecache } from "./api/imagecache.js";
// Kickstart index creation
import comicsIndex from "./comics.mjs";

const url = new URL(process.env.SERVER_URL);

const app = next({
  dev: process.env.NODE_ENV !== "production",
  dir: process.cwd(),
  port: process.env.SERVER_PORT,
  hostname: url.hostname
});
const handle = app.getRequestHandler();

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

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(compression()); // Enable Gzip
    server.use(morgan("tiny")); // Access logs

    // Static assets
    server.use("/images", express.static("images"));
    server.get(
      /\/images\/cache\/([a-zA-Z]*)\/(.*)/,
      imagecache
    );

    server.all("*", (req, res) => {
      handle(req, res);
    });

    server.listen(process.env.SERVER_PORT, err => {
      if (err) throw err;
      console.log(`> Started server on ${process.env.SERVER_URL}`);
    });
  })
  .catch(e => {
    console.error("Failed to start", e);
    process.exit(1);
  });
