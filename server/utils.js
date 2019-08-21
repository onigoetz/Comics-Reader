//@ts-check

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const sizes = require("./sizes");

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

function fromUrl(url) {
  return url.replace(/\|/g, "/");
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
    /\.(jpe?g|png|gif|webp)$/i.test(item) &&
    item.indexOf("__MACOSX") === -1
  );
}

function getValidImages(files) {
  return files.filter(validImageFilter);
}

function getBigatureSize(data) {
  const newWidth = sizes.big.width;
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

module.exports = {
  ensureDir,
  getExtension,
  getBigatureSize,
  getValidImages,
  isDirectorySync,
  isDirectory,
  isFile,
  validImageFilter,
  fromUrl
};
