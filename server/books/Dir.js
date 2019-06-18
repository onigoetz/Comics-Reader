//@ts-check

const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const naturalSort = require("natural-sort")();
const imageSize = require("image-size");

const {
  getBigatureSize,
  validImageFilter,
  isDirectorySync
} = require("../utils");
const config = require("../../config");

const readdir = promisify(fs.readdir);
const sizeOf = promisify(imageSize);

module.exports = class Dir {
  constructor(dirPath) {
    this.dir = dirPath;
  }

  async getFileNames() {
    return readdir(this.dir);
  }

  async extractFile(file) {
    return file;
  }

  async getPages() {
    const dirPath = this.dir;
    const files = await this.getFileNames();

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

    return Promise.all(promises);
  }
};
