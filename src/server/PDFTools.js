const fs = require("fs");

const tmp = require("tmp-promise");
const { promisify } = require("util");

const { exec, escape } = require("./exec");

const readFileAsync = promisify(fs.readFile);

// HACK few hacks to let PDF.js be loaded not as a module in global space.
require("pdf.js-extract/lib/pdfjs/domstubs.js").setStubs(global);
var pdfjsLib = require("pdf.js-extract/lib/pdfjs/pdf.combined");

module.exports = class PDFTools {
  constructor(file) {
    this.file = file;
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

    return await Promise.all(promises);

    //return await getInfo(this.file, {});
  }
};
