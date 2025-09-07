import path from "node:path";
import debugFn from "debug";
import sharp from "sharp";

import { ensureDir, normalizePath } from "../../../../utils.js";
import sizes from "../../../../sizes.js";
import { getFilePath, loadFile } from "../../../../imagecache.js";

const debug = debugFn("comics:server");

export default async function imagecache(req, res) {
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
