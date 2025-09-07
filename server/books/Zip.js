//@ts-check
import pathLib from "node:path";
import fs from "node:fs";

import unzipper from "unzipper";
import tmp from "tmp-promise";
import { Iconv } from "iconv";

import sizeOf from "image-size";

import {
  validImageFilter,
  getBigatureSize,
  sortNaturally
} from "../utils.js";

const iconv = new Iconv("UTF-8", "UTF-8//IGNORE");

function cleanupName(nameBuffer) {
  return iconv.convert(nameBuffer).toString("utf8");
}

function getPath({ path, isUnicode, pathBuffer }) {
  // if some legacy zip tool follow ZIP spec then this flag will be set
  return isUnicode ? path : cleanupName(pathBuffer);
}

class ZipBatch {
  async read(path) {
    const data = await fs.promises.readFile(path);
    return unzipper.Open.buffer(data);
  }

  async run(openedFile, actions) {
    const actionsByPath = actions.reduce((acc, action) => {
      if (!acc.hasOwnProperty(action.subPath)) {
        acc[action.subPath] = [];
      }

      acc[action.subPath].push(action);

      return acc;
    }, {});

    for (const file of openedFile.files) {
      const filePath = getPath(file);

      if (!actionsByPath.hasOwnProperty(filePath)) {
        continue;
      }

      for (const action of actionsByPath[filePath]) {
        action.handled = true;
        try {
          /* eslint-disable-next-line no-await-in-loop */
          action.deferred.resolve(await action.action(file));
        } catch (e) {
          console.error("Zip action failed", e);
          action.deferred.reject(e);
        }
      }
    }

    // If an action wasn't treated it wouldn't have the "action.handled" flag set to true
    // This means the file wasn't found and we need to reject the deferred promise
    Object.values(actionsByPath).forEach(actionsForPath => {
      actionsForPath.forEach(action => {
        if (!action.handled) {
          action.deferred.reject(new Error("File not found"));
        }
      });
    });

    console.log("Treated", actions.length, "actions in batch");
  }
}

export default class Zip {
  constructor(filePath, batchWorker) {
    this.path = filePath;
    this.batchWorker = batchWorker;
  }

  async openFile() {
    return unzipper.Open.file(this.path);
  }

  async getFileNames() {
    const directory = await this.openFile();
    return directory.files.map(entry => getPath(entry));
  }

  async extractFile(file) {
    return this.batchWorker.addTask(this.path, ZipBatch, {
      subPath: file,
      async action(entry) {
        const { path, cleanup } = await tmp.file({
          postfix: pathLib.extname(file).toLowerCase()
        });

        await new Promise((resolve, reject) => {
          entry
            .stream()
            .pipe(fs.createWriteStream(path))
            .on("error", reject)
            .on("finish", resolve);
        });

        return {
          path,
          cleanup
        };
      }
    });
  }

  async getPages() {
    const list = await this.openFile();

    const pages = [];
    for (const file of list.files) {
      if (!validImageFilter(file.path)) {
        continue;
      }

      /* eslint-disable-next-line no-await-in-loop */
      const data = sizeOf(await file.buffer());

      const size = getBigatureSize(data);

      pages.push({
        src: `${this.path}/${getPath(file)}`.replace(
          process.env.DIR_COMICS,
          ""
        ),
        width: size.width,
        height: size.height
      });
    }

    return pages.sort((a, b) => sortNaturally(a.src, b.src));
  }
}
