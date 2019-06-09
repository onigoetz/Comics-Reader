//@ts-check

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const config = require("../config");

const mkdirAsync = promisify(fs.mkdir);

function isFile(fullPath) {
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

function isDirectorySync(dirPath) {
  return fs.statSync(dirPath).isDirectory();
}

function isDirectory(fullPath) {
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

function getExtension(file) {
  return path.extname(file).toLowerCase();
}

function validImageFilter(item) {
  const filename = item.replace(/^.*[\\\/]/, "");
  return (
    filename.substring(0, 1) !== "." &&
    /\.(jpe?g|png|gif)$/i.test(item) &&
    item.indexOf("__MACOSX") === -1
  );
}

function getValidImages(files) {
  return files.filter(validImageFilter);
}

function getBigatureSize(data) {
  const newWidth = config.sizes.big.width;
  const ratio = data.width / data.height;

  return {
    width: newWidth,
    height: Math.round(newWidth / ratio)
  };
}

async function ensureDir(pathToCreate) {
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

function getManifest(BASE) {
  const manifest = require("../src/manifest.json");
  manifest.start_url = BASE;
  manifest.icons = manifest.icons.map(icon => {
    icon.src = BASE + icon.src;
    return icon;
  });

  return manifest;
}

function sanitizeBaseUrl(base) {
  // Ensure we have one slash at the beginning and one at the end
  const cleaned = `/${(base || "").replace(/^\/+|\/+$/g, "")}/`;

  // Ensure we don't have multiple consecutive slashes
  return cleaned.replace(/(.*\/)\/+/g, "$1");
}

function returnJsonNoCache(res, data) {
  res.setHeader("Cache-Control", "no-cache");
  res.json(data);
}

module.exports = {
  ensureDir,
  getExtension,
  getBigatureSize,
  getManifest,
  getValidImages,
  isDirectorySync,
  isDirectory,
  isFile,
  returnJsonNoCache,
  sanitizeBaseUrl,
  validImageFilter
};
