const path = require("path");
const debug = require("debug")("comics:server");
const sharp = require("sharp");
const { promisify } = require("util");
const imageSize = require("image-size");

const { ensureDir, normalizePath } = require("../utils");
const { getFile } = require("../books/index.js");
const sizes = require("../sizes");
const cache = require("../cache");

const sizeOf = promisify(imageSize);

const retinaRegex = /(.*)@2x\.(jpe?g|png|webp|gif)$/;
const webpConvertRegex = /\.webp\.png$/;

function getFilePath(requestedFile, presetName) {
  let sourceFile = requestedFile;

  // Clone preset if it has to be retinafied
  const preset = Object.assign({}, sizes[presetName]);

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

  return { preset, sourceFile, convertToPNG };
}

async function loadFile(sourceFile) {
  return getFile(path.join(process.env.DIR_COMICS, sourceFile));
}

async function getThumbnailSize(thumb) {
  const key = `THUMBNAIL_SIZE:v1:${thumb}`;
  return cache.wrap(key, async () => {
    const { sourceFile } = await getFilePath(thumb, "thumb");
    const file = await loadFile(sourceFile);
    const size = await sizeOf(file.path);
    const ratio = size.height / size.width;

    file.cleanup();

    return { height: 140, width: Math.floor(140 / ratio) };
  });
}

async function imagecache(req, res) {
  const presetName = req.params[0];
  const requestedFile = normalizePath(req.params[1]);

  debug("Generating Image", req.params[0], req.params[1]);

  if (!sizes.hasOwnProperty(presetName)) {
    res.status(404).send("Preset not found");
    return;
  }

  const { sourceFile, preset, convertToPNG } = await getFilePath(
    requestedFile,
    presetName
  );

  let file;
  try {
    file = await loadFile(sourceFile);
  } catch (e) {
    console.error("Cannot find image", e);
    res.status(404).send("Could not find image");
    return;
  }

  const destination = path.join(
    process.env.DIR_COMICS,
    "cache",
    presetName,
    requestedFile
  );

  await ensureDir(path.dirname(destination));

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
    console.error("Failed compression", e);
    file.cleanup();
    res.status(500).send("Could not compress image");
  }
}

module.exports = {
  imagecache,
  getThumbnailSize
};
