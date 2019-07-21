//@ts-check

const path = require("path");
const fs = require("fs");

const chalk = require("chalk").default;
const express = require("express");
const sharp = require("sharp");
const compression = require("compression");
const morgan = require("morgan");
const jwt = require("jwt-simple");
const bodyParser = require("body-parser");
const debug = require("debug")("comics:server");

const {
  ensureDir,
  sanitizeBaseUrl,
  returnJsonNoCache,
  getManifest
} = require("./utils");
const { getFile, getPages } = require("./books");
const IndexCreator = require("./tree/IndexCreator");
const Walker = require("./tree/Walker");
const config = require("../config");
const layout = require("./template");
const db = require("./db");
const auth = require("./auth");
const cache = require("./cache");

const error = chalk.red;
const title = chalk.underline.bold;

const GALLERY_ROOT = config.comics;

const comicsIndex = new IndexCreator(GALLERY_ROOT);
const BASE = sanitizeBaseUrl(process.env.COMICS_BASE);
const manifest = getManifest(BASE);
const app = express();

let indexReady = false;

app.use(compression()); // Enable Gzip
app.use(morgan("tiny")); // Access logs
app.use(bodyParser.json());
app.use(auth.initialize());

// Static assets
app.use("/static", express.static("static"));
app.use("/images", express.static("images"));

// Pages that return the main layout,
// might be custom server rendered later
// "/" "/login" "/logout" "/change_password" "/book/*" "/list/*" just return the template
app.get(
  /\/(|login|logout|change_password|book(\/.*)?|list(\/.*)?)$/,
  (req, res) =>
    layout(BASE, indexReady).then(
      template => res.send(template),
      () => res.status(500).send("Could not generate template")
    )
);

app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/images/favicon.ico"));
});

app.get(/\/thumb\/([0-9])\/(.*)/, async (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }

  const ratio = req.param[0];
  const book = req.params[1];

  let node;
  try {
    node = await comicsIndex.getNode(book);
  } catch (e) {
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

  let file = `cache/thumb/${node.getThumb()}`;

  // If webp is not supported by the browser, we'll use .webp.png as an extension
  // This will instruct the comics reader to convert the webp file to png and cache the result
  const accept = req.headers.accept;
  if (!accept || accept.indexOf('image/webp') === -1) {
    file = file.replace(/\.webp$/, ".webp.png")
  }

  const storedFile = path.join(GALLERY_ROOT, file);

  fs.exists(storedFile, exists => {
    if (exists) {
      res.sendFile(storedFile);
    } else {
      res.redirect(`${BASE}images/${file.replace(/#/g, "%23")}`);
    }
  });
});

app.get(/\/images\/cache\/([a-zA-Z]*)\/(.*)/, async (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const retinaRegex = /(.*)@2x\.(jpe?g|png|webp|gif)/;
  const webpConvertRegex = /(.*)\.webp\.png$/;
  const presetName = req.params[0];
  const requestedFile = req.params[1];
  let sourceFile = requestedFile;

  debug(title("Generating Image"), req.params[0], req.params[1]);

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

  let convertToPNG = false;
  if (webpConvertRegex.test(requestedFile)) {
    convertToPNG = true;
    sourceFile = sourceFile.replace(/\.webp\.png$/, ".webp");
  }

  const destination = path.join(
    GALLERY_ROOT,
    "cache",
    presetName,
    requestedFile
  );

  await ensureDir(path.dirname(destination));

  let file;
  try {
    file = await getFile(path.join(GALLERY_ROOT, sourceFile));
  } catch (e) {
    console.error(error("Cannot find image"), e);
    res.status(404).send("Could not find image");
    return;
  }

  try {
    let sharpObject = sharp(file.path).resize(
      preset.width || null,
      preset.height || null
    );

    // This means we got a webp request from a browser that doesn't support it.
    // To be sure, let's convert it
    if (convertToPNG) {
      sharpObject = sharpObject.toFormat("png");
    }

    await sharpObject.toFile(destination);

    file.cleanup();
    res.sendFile(destination);
  } catch (e) {
    console.error(error("Failed compression"), e);
    file.cleanup();
    res.status(500).send("Could not compress image");
  }
});

app.post("/api/change_password", auth.authenticate(), async (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const currentPassword = req.body.current_password;
  const password = req.body.password;

  if (!currentPassword || !password) {
    res.sendStatus(400);
    return;
  }

  let username;
  try {
    username = auth.getUser(req);
  } catch (e) {
    res.sendStatus(500);
    return;
  }

  const user = await auth.checkPassword(username, currentPassword);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  await db.changePassword(username, password);

  res.json({ success: true });
});

app.post("/api/token", async (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.sendStatus(401);
    return;
  }

  const user = await auth.checkPassword(username, password);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  const payload = {
    username
  };

  const token = jwt.encode(payload, config.jwtSecret);

  res.json({
    token
  });
});

app.get("/api/books", auth.authenticate(), async (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const walker = new Walker(await comicsIndex.getList());

  res.json(walker.toJson());
});

app.get("/api/read", auth.authenticate(), (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const read = db.getRead(auth.getUser(req));

  returnJsonNoCache(res, read);
});

app.post(/\/api\/read\/(.*)/, auth.authenticate(), (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const book = req.params[0];
  const user = auth.getUser(req);
  const read = db.markRead(user, book);

  returnJsonNoCache(res, read);
});

app.get(/\/api\/books\/(.*)/, auth.authenticate(), async (req, res) => {
  if (!indexReady) {
    res.status(503).send("Server Not Ready");
    return;
  }
  const book = req.params[0];
  const dirPath = path.join(GALLERY_ROOT, book);
  const key = `BOOK:v1:${dirPath}`;
  const pages = await cache.wrap(key, () => getPages(dirPath));

  returnJsonNoCache(res, pages);
});

console.log(title("Starting server"));
if (BASE === "/") {
  app.listen(config.port);
} else {
  // If we have a custom basepath, wrap our application as a
  // sub application with the basepath set to the main route.
  const outerApp = express();
  outerApp.use(BASE.replace(/\/+$/, ""), app);
  outerApp.listen(config.port);
}

console.log(title(`Started server on http://localhost:${config.port}${BASE}`));

console.log(title("Generating index"));
comicsIndex.getList().then(
  () => {
    indexReady = true;
    console.log(title("Index ready ! Have a good read !"));
  },
  e => {
    console.error(error("Could not create index"), e);
  }
);

process.on("unhandledRejection", e => {
  console.error(error("unhandledRejection"), e.message, e.stack);
});
