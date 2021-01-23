//@ts-check

const path = require("path");
const fs = require("fs");

const archiveType = require("archive-type");
const readChunk = require("read-chunk");
const debug = require("debug")("comics:archive");

const cache = require("../cache");
const { isDirectory, isFile, getExtension } = require("../utils");
const Zip = require("./Zip");
const Rar = require("./Rar");
const PDF = require("./PDF");
const Dir = require("./Dir");

const archives = [".cbr", ".cbz", ".zip", ".rar", ".pdf"];

function isArchive(extension) {
  return archives.indexOf(extension.toLowerCase()) !== -1;
}

async function open(file) {
  debug("Opening archive", file);
  if (await isDirectory(file)) {
    debug("It's a directory", file);
    return new Dir(file);
  }

  if (path.extname(file).toLowerCase() === ".pdf") {
    return new PDF(file);
  }

  // Check with mime type, people tend to misname cbr/cbz files
  const buffer = await readChunk(file, 0, 262);
  const type = archiveType(buffer);

  switch (type.mime) {
    case "application/zip":
      return new Zip(file);
    case "application/x-rar-compressed":
      return new Rar(file);
    default:
      throw new Error(`Could not open archive of type ${type.mime}`);
  }
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
    // eslint-disable-next-line no-await-in-loop
    if (isArchive(extension) && (await isFile(fileDir))) {
      return fileDir;
    }

    previous = fileDir;
    fileDir = path.dirname(fileDir);
  } while (fileDir !== previous);

  return false;
}

async function getFileNames(dirPath) {
  const archive = await open(dirPath);

  return archive.getFileNames();
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

  if (isArchive(getExtension(sourceFile))) {
    const archive = await open(sourceFile);
    return archive.extractFile(fileInside);
  }

  throw new Error("Could not get file");
}

async function getPages(book) {
  const dirPath = path.join(process.env.DIR_COMICS, book);
  const key = `BOOK:v1:${dirPath}`;
  return await cache.wrap(key, async () => {
    const archive = await open(dirPath);
    return archive.getPages();
  });
}

module.exports = {
  getFileNames,
  getFile,
  getPages
};
