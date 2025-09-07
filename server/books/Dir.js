//@ts-check

import path from "node:path";
import fs from "node:fs/promises";

import { imageSizeFromFile } from "image-size/fromFile";

import {
  getBigatureSize,
  validImageFilter,
  isDirectorySync,
  sortNaturally
} from "../utils.js";

export default class Dir {
  constructor(dirPath) {
    this.dir = dirPath;
  }

  async getFileNames() {
    return fs.readdir(this.dir);
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
        const data = await imageSizeFromFile(fullPath);
        const size = getBigatureSize(data);

        return {
          src: fullPath.replace(process.env.DIR_COMICS, ""),
          width: size.width,
          height: size.height
        };
      });

    return Promise.all(promises);
  }
}
