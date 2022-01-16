//@ts-check

import path from "path";
import { promisify } from "util";

import imageSize from "image-size";
import tmp from "tmp-promise";
import rimraf from "rimraf";

import { getValidImages, getBigatureSize, sortNaturally } from "../utils.js";

const sizeOf = promisify(imageSize);

export default class Compressed {
  constructor(filePath) {
    this.path = filePath;
  }

  async getFileNames() {
    throw new Error("Missing implementation");
  }

  async extractAll(destination) {
    throw new Error("Missing implementation");
  }

  async getPages() {
    const images = getValidImages(await this.getFileNames());

    const tmpdir = await tmp.dir();

    await this.extractAll(tmpdir.path);

    const promises = images.sort(sortNaturally).map(async image => {
      const data = await sizeOf(path.join(tmpdir.path, image));
      const size = getBigatureSize(data);

      return {
        src: `${this.path}/${image}`.replace(process.env.DIR_COMICS, ""),
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
};
