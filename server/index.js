//@ts-check
const next = require("next");
const chalk = require("chalk").default;
const express = require("express");

const loudRejection = require("loud-rejection");
const compression = require("compression");
const morgan = require("morgan");

require("./env");

// Kickstart index creation
require("./comics");

const title = chalk.underline.bold;

const app = next({
  dev: process.env.NODE_ENV !== "production",
  dir: process.cwd()
});
const handle = app.getRequestHandler();

loudRejection();

console.log(title("Starting server"));

app.prepare().then(() => {
  const server = express();

  server.use(compression()); // Enable Gzip
  server.use(morgan("tiny")); // Access logs

  // Static assets
  server.use("/static", express.static("static"));
  server.use("/images", express.static("images"));
  server.get("/manifest.json", require("./api/manifest"));
  server.get("/favicon.ico", require("./api/favicon"));
  server.get(/\/images\/cache\/([a-zA-Z]*)\/(.*)/, require("./api/imagecache"));

  server.all("*", (req, res) => {
    handle(req, res);
  });

  server.listen(process.env.SERVER_PORT);

  console.log(title(`Started server on ${process.env.SERVER_URL}`));
});
