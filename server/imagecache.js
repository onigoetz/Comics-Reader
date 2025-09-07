import path from "node:path";

import { imageSizeFromFile } from "image-size/fromFile";

import cache from "./cache.js";
import sizes from "./sizes.js";

import { getFile } from "./books/index.js";

const retinaRegex = /(.*)@2x\.(jpe?g|png|webp|gif)$/;
const webpConvertRegex = /\.webp\.png$/;

export async function loadFile(sourceFile) {
  return getFile(path.join(process.env.DIR_COMICS, sourceFile));
}

export function getFilePath(requestedFile, presetName) {
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

export async function getThumbnailSize(thumb) {
  const key = `THUMBNAIL_SIZE:v1:${thumb}`;
  return cache.wrap(key, async () => {
    const { sourceFile } = await getFilePath(thumb, "thumb");
    const file = await loadFile(sourceFile);
    const size = await imageSizeFromFile(file.path);
    const ratio = size.height / size.width;

    file.cleanup();

    return { height: 140, width: Math.floor(140 / ratio) };
  });
}
