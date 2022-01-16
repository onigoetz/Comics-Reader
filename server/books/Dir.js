//@ts-check

import path from "path";
import fs from "fs";
import { promisify } from "util";

import imageSize from "image-size";

import {
  getBigatureSize,
  validImageFilter,
  isDirectorySync,
  sortNaturally
} from "../utils.js";

const readdir = promisify(fs.readdir);
const sizeOf = promisify(imageSize);

export default class Dir {
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
      .sort(sortNaturally)
      .map(async item => {
        const fullPath = path.join(dirPath, item);
        const data = await sizeOf(fullPath);
        const size = getBigatureSize(data);

        return {
          src: fullPath.replace(process.env.DIR_COMICS, ""),
          width: size.width,
          height: size.height
        };
      });

    return Promise.all(promises);
  }
};
