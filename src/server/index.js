const path = require("path");
const fs = require("fs");

const express = require("express");
const sharp = require("sharp");
const compression = require("compression");
const cache = require("node-file-cache").create();

const IndexCreator = require("./tree/IndexCreator");
const Walker = require("./tree/Walker");
const config = require("../../config");
const {
  getPages,
  getFile,
  ensureDir,
  sanitizeBaseUrl,
  returnJsonNoCache,
  getUser
} = require("./utils");
const layout = require("./template");
const db = require("./db");

console.log("Generating index");

const comicsIndex = new IndexCreator(config.comics, true);

console.log("Starting server");

const BASE = sanitizeBaseUrl(process.env.COMICS_BASE);
const app = express();

// Enable Gzip
app.use(compression());

// Static assets
app.use("/static", express.static("static"));
app.use("/images", express.static("images"));

// Pages that return the main layout,
// might be custom server rendered later
app.get("/", (req, res) =>
  layout(BASE).then(
    template => res.send(template),
    () => res.status(500).send("Could not generate template")
  )
);
app.get("/book/*", (req, res) =>
  layout(BASE).then(
    template => res.send(template),
    () => res.status(500).send("Could not generate template")
  )
);
app.get("/list/*", (req, res) =>
  layout(BASE).then(
    template => res.send(template),
    () => res.status(500).send("Could not generate template")
  )
);

app.get("/manifest.json", (req, res) => {
  const manifest = require("../manifest.json");
  manifest.start_url = BASE;
  manifest.icons = manifest.icons.map(icon => {
    icon.src = BASE + icon.src;
    return icon;
  });

  res.json(manifest);
});

app.get(/\/thumb\/([0-9])\/(.*)/, (req, res) => {
  const ratio = req.param[0];
  const book = req.params[1];
  const node = comicsIndex.getList().getNode(book);

  if (!node) {
    res.status(404).send("Book not found");
    return;
  }

  let image = node.getThumb();

  if (!image) {
    res.status(404).send("Thumb not found");
    return;
  }

  if (ratio !== 1) {
    image = image.replace(/(\.[A-z]{3,4}\/?(\?.*)?)$/, `@${ratio}x$1`);
  }

  const file = `cache/thumb/${node.getThumb()}`;
  const storedFile = path.join(config.comics, file);

  if (fs.existsSync(storedFile)) {
    res.sendFile(storedFile);
  } else {
    res.redirect(`${BASE}images/${file.replace("#", "%23")}`);
  }
});

app.get("/api/books", (req, res) => {
  const walker = new Walker(comicsIndex.getList());

  res.json(walker.toJson());
});

app.get("/api/read", (req, res) => {
  const user = getUser(req);
  const read = db.getRead(user);

  returnJsonNoCache(res, read);
});

app.post(/\/api\/read\/(.*)/, (req, res) => {
  const book = req.params[0];
  const user = getUser(req);
  const read = db.markRead(user, book);

  returnJsonNoCache(res, read);
});

app.get(/\/api\/books\/(.*)/, (req, res) => {
  const book = req.params[0];
  const dirPath = path.join(config.comics, book);
  const key = `BOOK_${dirPath}`;

  const pages = cache.get(key);

  if (pages) {
    returnJsonNoCache(res, pages);
    return;
  }

  getPages(dirPath).then(result => {
    cache.set(key, result);
    returnJsonNoCache(res, result);
  });
});

app.get(/\/images\/cache\/([a-zA-Z]*)\/(.*)/, (req, res) => {
  const retinaRegex = /(.*)@2x\.(jpe?g|png|webp|gif)/;
  const presetName = req.params[0];
  const requestedFile = req.params[1];
  let sourceFile = requestedFile;

  console.log("Generating Image", req.params[0], req.params[1]);

  if (!config.sizes.hasOwnProperty(presetName)) {
    res.status(404).send("Preset not found");
    return;
  }

  // Clone preset if it has to be retinafied
  const preset = Object.assign({}, config.sizes[presetName]);

  // Retinafy preset
  if (retinaRegex.test(requestedFile)) {
    const matches = retinaRegex.exec(requestedFile);
    sourceFile = `${matches[1]}.${matches[2]}`;

    preset.width = preset.width ? preset.width * 2 : null;
    preset.height = preset.height ? preset.height * 2 : null;
  }

  const destination = path.join(
    config.comics,
    "cache",
    presetName,
    requestedFile
  );
  ensureDir(path.dirname(destination));

  const file = getFile(path.join(config.comics, sourceFile));

  if (!file) {
    res.status(404).send("Could not find image");
    return;
  }

  sharp(file.file)
    .resize(preset.width || null, preset.height || null)
    .toFile(destination)
    .then(
      () => {
        file.cleanup();
        res.sendFile(destination);
      },
      e => {
        console.log("Failed compression", e);
        file.cleanup();
        res.status(500).send("Could not compress image");
      }
    );
});

if (BASE === "/") {
  app.listen(config.port);
} else {
  // If we have a custom basepath, wrap our application as a
  // sub application with the basepath set to the main route.
  const outerApp = express();
  outerApp.use(BASE.replace(/\/+$/, ""), app);
  outerApp.listen(config.port);
}

console.log("Started server on port", config.port, "with baseurl", BASE);
