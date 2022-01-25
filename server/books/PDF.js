//@ts-check
const fs = require("fs");

const tmp = require("tmp-promise");
require("pdfjs-dist/lib/examples/node/domstubs").setStubs(global);
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const { exec, createTempSymlink } = require("../exec");
const { getBigatureSize } = require("../utils");

module.exports = class PDF {
  constructor(file) {
    this.file = file;
  }

  async extractFile(file) {
    return this.extractPage(parseInt(file.replace(".png", ""), 10));
  }

  async getFileNames() {
    return [];
  }

  async getDocument() {
    const data = new Uint8Array(await fs.promises.readFile(this.file));
    return pdfjs.getDocument({ data }).promise;
  }

  async extractPage(pageNum) {
    const file = await tmp.file({ postfix: ".png" });

    const { filePath, cleanup } = await createTempSymlink(this.file);

    const command = [
      "mutool",
      "draw",
      "-c",
      "rgb",
      "-r",
      "200",
      "-o",
      file.path,
      filePath,
      pageNum
    ];

    try {
      // PDF Conversion can be very slow
      await exec(command, { timeout: 15000 });
      cleanup();
    } catch (e) {
      console.error("Failed extracting image", e);
      throw e;
    }

    return file;
  }

  async getImageSizes() {
    const doc = await this.getDocument();

    var loadPage = async function(pageNum) {
      const page = await doc.getPage(pageNum);
      return page.getViewport({ scale: 1 });
    };

    const promises = [];
    var numPages = doc.numPages;
    for (var i = 1; i <= numPages; i++) {
      promises.push(loadPage(i));
    }

    return Promise.all(promises);
  }

  async getPages() {
    let i = 0;

    const pages = await this.getImageSizes();

    return pages.map(image => {
      i++;
      const size = getBigatureSize(image);

      return {
        src: `${this.file}/${i}.png`.replace(process.env.DIR_COMICS, ""),
        width: size.width,
        height: size.height
      };
    });
  }
};
