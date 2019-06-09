//@ts-check
const fs = require("fs");
const { promisify } = require("util");

const tmp = require("tmp-promise");
require("pdf.js-extract/lib/pdfjs/domstubs.js").setStubs(global);
const pdfjsLib = require("pdf.js-extract/lib/pdfjs/pdf");

const { exec, escape, createTempSymlink } = require("../exec");
const { getBigatureSize } = require("../utils");
const config = require("../../config");

const readFileAsync = promisify(fs.readFile);

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

  async extractPageWithLib(pageNum) {
    const doc = await pdfjsLib.getDocument({
      verbosity: -1,
      data: new Uint8Array(await readFileAsync(this.file))
    });

    const page = await doc.getPage(pageNum);
    const opList = await page.getOperatorList();
    const filteredList = opList.argsArray.filter(
      (item, index) =>
        opList.fnArray[index] === 82 && // 82 = paintJpegXObject
        Array.isArray(item) &&
        item.length === 3 &&
        page.objs.objs[item[0]] // Does the object exist ?
    );

    if (filteredList.length !== 1) {
      throw new Error(
        "Could not find a JPG image on this page or find too many"
      );
    }

    const obj = page.objs.objs[filteredList[0][0]];

    // remove "data:image/jpeg;base64," from the string
    const base64Object = obj.data._src.substring(23);

    return {
      path: Buffer.from(base64Object, "base64"),
      cleanup: () => {}
    };
  }

  async extractPage(pageNum) {
    try {
      return this.extractPageWithLib(pageNum);
    } catch (e) {
      console.error(`Could not extract file ${e.message}`);
    }

    // the convert command takes zero-indexed page numbers
    const page = pageNum - 1;
    const file = await tmp.file({ postfix: ".png" });

    const { filePath, cleanup } = await createTempSymlink(this.file);

    const command = `convert -density 400 ${escape(
      `${filePath}[${page}]`
    )} ${escape(file.path)} `;

    try {
      await exec(command);
      cleanup();
    } catch (e) {
      console.error("Failed extracting image", e);
      throw e;
    }

    return file;
  }

  async getImageSizes() {
    const doc = await pdfjsLib.getDocument({
      verbosity: -1,
      data: new Uint8Array(await readFileAsync(this.file))
    });

    var loadPage = async function(pageNum) {
      const page = await doc.getPage(pageNum);
      return page.getViewport(1.0 /* scale */);
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
