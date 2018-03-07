const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const sizeOf = promisify(require("image-size"));
const tmp = require("tmp-promise");
const rimraf = require("rimraf");
const auth = require("basic-auth");
const naturalSort = require("natural-sort")();

const openArchive = require("./archives/index");
const PDFTools = require("./PDFTools");
const config = require("../../config");

const readdir = promisify(fs.readdir);
const mkdirAsync = promisify(fs.mkdir);

const archives = [".cbr", ".cbz", ".zip", ".rar"];
const packagedFormats = [".pdf"].concat(archives);

function isFile(fullPath) {
  return new Promise((resolve, reject) => {
    fs.stat(fullPath, (err, stat) => {
      err ? resolve(false) : resolve(stat.isFile());
    });
  });
}

function isDirectorySync(dirPath) {
  return fs.statSync(dirPath).isDirectory();
}

function isDirectory(fullPath) {
  return new Promise((resolve, reject) => {
    fs.stat(fullPath, (err, stat) => {
      err ? resolve(false) : resolve(stat.isDirectory());
    });
  });
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
  const newWidth = config.sizes.big.width;
  const ratio = data.width / data.height;

  return {
    width: newWidth,
    height: parseInt(Math.round(newWidth / ratio), 0)
  };
}

async function getPagesFromDir(dirPath) {
  const files = await readdir(dirPath);

  const promises = files
    .filter(
      item =>
        validImageFilter(item) && !isDirectorySync(path.join(dirPath, item))
    )
    .sort(naturalSort)
    .map(async item => {
      const fullPath = path.join(dirPath, item);
      const data = await sizeOf(fullPath);
      const size = getBigatureSize(data);

      return {
        src: fullPath.replace(config.comics, ""),
        width: size.width,
        height: size.height
      };
    });

  return await Promise.all(promises);
}

async function getPagesFromArchive(dirPath) {
  const archive = await openArchive(dirPath);
  const images = getValidImages(await archive.getFileNames());

  const tmpdir = await tmp.dir();

  await archive.extractTo(tmpdir.path);

  const promises = images.sort(naturalSort).map(async image => {
    const data = await sizeOf(path.join(tmpdir.path, image));
    const size = getBigatureSize(data);

    return {
      src: `${dirPath}/${image}`.replace(config.comics, ""),
      width: size.width,
      height: size.height
    };
  });

  const pages = await Promise.all(promises);

  rimraf(path.join(tmpdir.path, "*"), err => {
    if (err) {
      console.error(err);
      return;
    }
    tmpdir.cleanup();
  });

  return pages.filter(item => item);
}

async function getPagesFromPdf(file) {
  let i = 0;
  const pdf = new PDFTools(file);

  const pages = await pdf.getImageSizes();

  return pages.map(image => {
    i++;
    const size = getBigatureSize(image);

    return {
      src: `${file}/${i}.png`.replace(config.comics, ""),
      width: size.width,
      height: size.height
    };
  });
}

async function getPages(dirPath) {
  if (await isDirectory(dirPath)) {
    return getPagesFromDir(dirPath);
  }

  if (archives.indexOf(getExtension(dirPath)) !== -1) {
    return getPagesFromArchive(dirPath);
  }

  if (getExtension(dirPath) === ".pdf") {
    return getPagesFromPdf(dirPath);
  }

  throw new Error("Unknown format");
}

async function getSourceFile(file) {
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
    if (packagedFormats.indexOf(extension) !== -1 && (await isFile(fileDir))) {
      return fileDir;
    }

    previous = fileDir;
    fileDir = path.dirname(fileDir);
  } while (fileDir !== previous);

  return false;
}

async function getFile(file) {
  const sourceFile = await getSourceFile(file);

  if (!sourceFile) {
    throw new Error("No file found");
  }

  if (file === sourceFile) {
    return { path: sourceFile, cleanup: () => {} };
  }

  const fileInside = file.replace(`${sourceFile}/`, "");

  if (getExtension(sourceFile) === ".pdf") {
    const pdf = new PDFTools(sourceFile);
    return pdf.extractPage(fileInside.replace(".png", "") - 1);
  }

  if (archives.indexOf(getExtension(sourceFile)) !== -1) {
    const archive = await openArchive(sourceFile);
    return archive.extractFile(fileInside);
  }

  throw new Error("Could not get file");
}

async function ensureDir(pathToCreate) {
  const parts = pathToCreate.split(path.sep);

  let fullPath = "";
  for (var i in parts) {
    fullPath = fullPath + parts[i] + path.sep;
    if (!await isDirectory(fullPath)) {
      await mkdirAsync(fullPath);
    }
  }
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
  isDirectorySync,
  getPages,
  getFile,
  ensureDir,
  sanitizeBaseUrl,
  returnJsonNoCache,
  getUser
};
