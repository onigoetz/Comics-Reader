const fs = require("fs");
const path = require("path");

const sizeOf = require("image-size");
const tmp = require("tmp");
const rimraf = require("rimraf");
const auth = require("basic-auth");
const naturalSort = require("node-natural-sort")();

const openArchive = require("./archives/index");
const PDFTools = require("./PDFTools");
const config = require("../../config");

const archives = [".cbr", ".cbz", ".zip", ".rar"];
const packagedFormats = [".pdf"].concat(archives);

class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getRatio() {
    return this.width / this.height;
  }

  resizeWidth(width) {
    const ratio = this.getRatio();
    this.width = width;
    this.height = parseInt(Math.round(this.width / ratio), 0);
  }
}

function isFile(dirPath) {
  return fs.statSync(dirPath).isFile();
}

function isDirectory(dirPath) {
  return fs.statSync(dirPath).isDirectory();
}

function getExtension(file) {
  return path.extname(file).toLowerCase();
}

function validImageFilter(item) {
  return /\.(jpe?g|png|gif)$/i.test(item) && item.substring(0, 1) !== ".";
}

function getValidImages(files) {
  return files.filter(validImageFilter);
}

function getBigatureSize(data) {
  const size = new Size(data.width, data.height);
  size.resizeWidth(config.sizes.big.width);
  return size;
}

function getPagesFromDir(dirPath) {
  const pages = fs
    .readdirSync(dirPath)
    .filter(
      item => validImageFilter(item) && !isDirectory(path.join(dirPath, item))
    )
    .sort(naturalSort)
    .map(item => {
      const fullPath = path.join(dirPath, item);
      const data = sizeOf(fullPath);
      const size = getBigatureSize(data);

      return {
        src: fullPath.replace(config.comics, ""),
        width: size.width,
        height: size.height
      };
    });

  return Promise.resolve(pages);
}

function getPagesFromArchive(dirPath) {
  const archive = openArchive(dirPath);
  const images = getValidImages(archive.getFileNames());

  const tmpdir = tmp.dirSync();
  archive.extractTo(tmpdir.name);

  const pages = images
    .map(image => {
      const data = sizeOf(path.join(tmpdir.name, image));
      const size = getBigatureSize(data);

      return {
        src: `${dirPath}/${image}`.replace(config.comics, ""),
        width: size.width,
        height: size.height
      };
    })
    .filter(item => item);

  rimraf(path.join(tmpdir.name, "*"), () => {
    tmpdir.removeCallback();
  });

  return Promise.resolve(pages);
}

function getPagesFromPdf(file) {
  let i = 0;
  const pdf = new PDFTools(file);

  return pdf.getImageSizes().then(pages =>
    pages.map(image => {
      i++;
      const size = getBigatureSize(image);

      return {
        src: `${file}/${i}.png`.replace(config.comics, ""),
        width: size.width,
        height: size.height
      };
    })
  );
}

function getPages(dirPath) {
  if (isDirectory(dirPath)) {
    return getPagesFromDir(dirPath);
  }

  if (archives.indexOf(getExtension(dirPath)) !== -1) {
    return getPagesFromArchive(dirPath);
  }

  if (getExtension(dirPath) === ".pdf") {
    return getPagesFromPdf(dirPath);
  }

  return [];
}

function getSourceFile(file) {
  // it's a regular file
  if (fs.existsSync(file)) {
    return file;
  }

  // If we're here it didn't work the first time,
  // so we'll already jump up one level
  let fileDir = path.dirname(file);
  let previous;

  do {
    const extension = getExtension(fileDir);
    if (packagedFormats.indexOf(extension) !== -1 && isFile(fileDir)) {
      return fileDir;
    }

    previous = fileDir;
    fileDir = path.dirname(fileDir);
  } while (fileDir !== previous);

  return false;
}

function getFile(file) {
  const sourceFile = getSourceFile(file);

  if (!sourceFile) {
    return false;
  }

  if (file === sourceFile) {
    return { file: sourceFile, cleanup: () => {} };
  }

  const fileInside = file.replace(`${sourceFile}/`, "");

  //console.log("Got", sourceFile, "for", file, "extracting", fileInside);

  if (getExtension(sourceFile) === ".pdf") {
    const pdf = new PDFTools(sourceFile);
    return pdf.extractPage(fileInside.replace(".png", "") - 1);
  }

  if (archives.indexOf(getExtension(sourceFile)) !== -1) {
    return openArchive(sourceFile).extractFile(fileInside);
  }

  return false;
}

function ensureDir(pathToCreate) {
  pathToCreate.split(path.sep).reduce((thisPath, folder) => {
    const currentPath = thisPath + folder + path.sep;
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
    return currentPath;
  }, "");
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

function getUser(req) {
  const authentication = auth(req);
  return authentication ? authentication.name : "anonymous";
}

module.exports = {
  getValidImages,
  isDirectory,
  getPages,
  getFile,
  ensureDir,
  sanitizeBaseUrl,
  returnJsonNoCache,
  getUser
};
