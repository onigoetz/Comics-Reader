const path = require("path");
const debug = require("debug")("comics:server");
const sharp = require("sharp");

const { ensureDir } = require("../utils");
const { getFile } = require("../books");
const sizes = require("../sizes");

const retinaRegex = /(.*)@2x\.(jpe?g|png|webp|gif)/;
const webpConvertRegex = /(.*)\.webp\.png$/;

module.exports = async function(req, res) {
  const presetName = req.params[0];
  const requestedFile = req.params[1];
  let sourceFile = requestedFile;

  debug("Generating Image", req.params[0], req.params[1]);

  if (!sizes.hasOwnProperty(presetName)) {
    res.status(404).send("Preset not found");
    return;
  }

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

  const destination = path.join(
    process.env.DIR_COMICS,
    "cache",
    presetName,
    requestedFile
  );

  await ensureDir(path.dirname(destination));

  let file;
  try {
    file = await getFile(path.join(process.env.DIR_COMICS, sourceFile));
  } catch (e) {
    console.error("Cannot find image", e);
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
    console.error("Failed compression", e);
    file.cleanup();
    res.status(500).send("Could not compress image");
  }
};
