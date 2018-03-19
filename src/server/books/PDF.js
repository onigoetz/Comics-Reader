const fs = require("fs");
const { promisify } = require("util");

const tmp = require("tmp-promise");
require("pdf.js-extract/lib/pdfjs/domstubs.js").setStubs(global);
const pdfjsLib = require("pdf.js-extract/lib/pdfjs/pdf.combined");

const { exec, escape } = require("../exec");
const { getBigatureSize } = require("../utils");
const config = require("../../../config");

const readFileAsync = promisify(fs.readFile);

module.exports = class PDF {
  constructor(file) {
    this.file = file;
  }

  async extractFile(file) {
    return this.extractPage(file.replace(".png", "") - 1);
  }

  async extractPage(page) {
    const file = await tmp.file({ postfix: ".png" });

    const command = `convert -density 400 ${escape(
      `${this.file}[${page}]`
    )} ${escape(file.path)} `;

    try {
      await exec(command);
    } catch (e) {
      console.log("Failed extracting image", e);
      throw e;
    }

    return file;
  }

  async getImageSizes() {
    const doc = await pdfjsLib.getDocument({
      verbosity: -1,
      data: new Uint8Array(await readFileAsync(this.file))
    });

    var loadPage = function(pageNum) {
      return doc
        .getPage(pageNum)
        .then(page => page.getViewport(1.0 /* scale */));
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
        src: `${this.file}/${i}.png`.replace(config.comics, ""),
        width: size.width,
        height: size.height
      };
    });
  }
};
