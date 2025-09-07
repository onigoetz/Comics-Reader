//@ts-check
import pathLib from "node:path";
import fs from "node:fs/promises";

import toBuffer from "typedarray-to-buffer";

import unrar from "node-unrar-js";
import tmp from "tmp-promise";

import sizeOf from "image-size";

import { validImageFilter, getBigatureSize, sortNaturally } from "../utils.js";

// Documentation of the unrar command :
// http://acritum.com/winrar/console-rar-manual

class RarBatch {
  async read(path) {
    const data = await fs.readFile(path);
    return unrar.createExtractorFromData({ data });
  }

  async run(openedFile, actions) {
    const actionsByPath = actions.reduce((acc, action) => {
      if (!acc.hasOwnProperty(action.subPath)) {
        acc[action.subPath] = [];
      }

      acc[action.subPath].push(action);

      return acc;
    }, {});

    const list = openedFile.extract({ files: Object.keys(actionsByPath) });

    for (const file of list.files) {
      for (const action of actionsByPath[file.fileHeader.name]) {
        action.handled = true;
        try {
          /* eslint-disable-next-line no-await-in-loop */
          action.deferred.resolve(await action.action(file));
        } catch (e) {
          console.error("Rar action failed", e);
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

export default class Rar {
  constructor(filePath, batchWorker) {
    this.path = filePath;
    this.batchWorker = batchWorker;
  }

  async getFileNames() {
    const extractor = await unrar.createExtractorFromFile({
      filepath: this.path
    });

    const list = extractor.getFileList();
    return [...list.fileHeaders].map(file => file.name);
  }

  async extractFile(file) {
    return this.batchWorker.addTask(this.path, RarBatch, {
      subPath: file,
      async action(extractedFile) {
        const { path, cleanup } = await tmp.file({
          postfix: pathLib.extname(file).toLowerCase()
        });

        await fs.writeFile(path, extractedFile.extraction);

        return {
          path,
          cleanup
        };
      }
    });
  }

  /**
   * This function is a bit slower than using unrar directly in direct benchmark.
   * But in exchange it's memory only, uses no separate binary and
   * doesn't write files to a temporary folder
   * @returns
   */
  async getPages() {
    const buf = await fs.readFile(this.path);
    const extractor = await unrar.createExtractorFromData({ data: buf });

    const list = extractor.extract({
      // Only extract actual files
      files: fileHeader => validImageFilter(fileHeader.name)
    });

    const pages = [];
    for (const file of list.files) {
      const data = sizeOf(toBuffer(file.extraction));

      const size = getBigatureSize(data);

      pages.push({
        src: `${this.path}/${file.fileHeader.name}`.replace(
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
