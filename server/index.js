//@ts-check
const next = require("next");
const { red, underline, bold } = require("colorette");
const express = require("express");

const loudRejection = require("loud-rejection");
const compression = require("compression");
const morgan = require("morgan");
const cron = require("node-cron");

require("./env");

// Kickstart index creation
const comicsIndex = require("./comics");

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
      require("./api/imagecache").imagecache
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
