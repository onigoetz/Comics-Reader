//@ts-check
const pathLib = require("path");
const fs = require("fs");

const toBuffer = require('typedarray-to-buffer');

const unrar = require('node-unrar-js');
const tmp = require("tmp-promise");

const Compressed = require("./Compressed");
const { exec, createTempSymlink } = require("../exec");

const sizeOf = require("image-size");

const { validImageFilter, getBigatureSize, sortNaturally } = require("../utils");

// Documentation of the unrar command :
// http://acritum.com/winrar/console-rar-manual

module.exports = class Rar extends Compressed {
  async getFileNames() {
    const extractor = await unrar.createExtractorFromFile({ filepath: this.path });

    const list = extractor.getFileList();
    return  [...list.fileHeaders].map(file => file.name);
  }

  async extractFile(file) {
    const buf = await fs.promises.readFile(this.path)
    const extractor = await unrar.createExtractorFromData({ data: buf });

    const list = extractor.extract({
      // Only extract actual files
      files: (fileHeader) => validImageFilter(fileHeader.name)
    });

    const extractedFile = list.files.next();
    
    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    await fs.promises.writeFile(path, extractedFile.value.extraction);

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    await exec(["unrar", "x", filePath, destination]);

    cleanup();
  }

  /**
   * This function is a bit slower than using unrar directly in direct benchmark.
   * But in exchange it's memory only, uses no separate binary and 
   * doesn't write files to a temporary folder
   * @returns 
   */
  async getPages() {
    const buf = await fs.promises.readFile(this.path)
    const extractor = await unrar.createExtractorFromData({ data: buf });

    const list = extractor.extract({
      // Only extract actual files
      files: (fileHeader) => validImageFilter(fileHeader.name)
    });

    const pages = [];
    for (let file of list.files) {
      const data = sizeOf(toBuffer(file.extraction));

      const size = getBigatureSize(data);

      pages.push({
        src: `${this.path}/${file.fileHeader.name}`.replace(process.env.DIR_COMICS, ""),
        width: size.width,
        height: size.height
      });

    }

    return pages.sort((a, b) => sortNaturally(a.src, b.src));

  }
};
