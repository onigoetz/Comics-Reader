//@ts-check

import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import natsort from "natural-sort";

import sizes from "./sizes.js";

export const sortNaturally = natsort();

const mkdirAsync = promisify(fs.mkdir);

export function createDeferred() {
  var deferred = {};
  var promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  deferred.promise = promise;
  return deferred;
}

export function normalizePath(unsafeSuffix) {
  return path.normalize(unsafeSuffix).replace(/^(\.\.(\/|\\|$))+/, "");
}

export function isFile(fullPath) {
  return new Promise(resolve => {
    fs.stat(fullPath, (err, stat) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stat.isFile());
      }
    });
  });
}

export function fromUrl(url) {
  return url.replace(/\|/g, "/");
}

export function isDirectorySync(dirPath) {
  return fs.statSync(dirPath).isDirectory();
}

export function isDirectory(fullPath) {
  return new Promise(resolve => {
    fs.stat(fullPath, (err, stat) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stat.isDirectory());
      }
    });
  });
}

export function getExtension(file) {
  return path.extname(file).toLowerCase();
}

export function validImageFilter(item) {
  const filename = item.replace(/^.*[\\\/]/, "");
  return (
    filename.substring(0, 1) !== "." &&
    /\.(jpe?g|png|gif|webp)$/i.test(item) &&
    item.indexOf("__MACOSX") === -1
  );
}

export function getValidImages(files) {
  return files.filter(validImageFilter);
}

export function getBigatureSize(data) {
  const newWidth = sizes.big.width;
  const ratio = data.width / data.height;

  return {
    width: newWidth,
    height: Math.round(newWidth / ratio)
  };
}

export async function ensureDir(pathToCreate) {
  const parts = pathToCreate.split(path.sep);

  let fullPath = "";
  for (var i in parts) {
    if (parts.hasOwnProperty(i)) {
      fullPath = fullPath + parts[i] + path.sep;
      // eslint-disable-next-line no-await-in-loop
      if (!(await isDirectory(fullPath))) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await mkdirAsync(fullPath);
        } catch (e) {
          // If the error is EEXIST, we probably created the
          // folder at the same time as another request
          // We can ignore this safely
          if (e.code !== "EEXIST") {
            throw e;
          }
        }
      }
    }
  }
}
