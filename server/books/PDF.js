//@ts-check
const fs = require("fs");
const { promisify } = require("util");

const tmp = require("tmp-promise");
require("pdfjs-dist/lib/examples/node/domstubs").setStubs(global);
const pdfjs = require("pdfjs-dist");

const { exec, createTempSymlink } = require("../exec");
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

  async getDocument() {
    return pdfjs.getDocument({
      data: new Uint8Array(await readFileAsync(this.file))
    }).promise;
  }

  async extractPageWithLib(pageNum) {
    const doc = await this.getDocument();

    const page = await doc.getPage(pageNum);
    const ops = await page.getOperatorList();
    const images = [];

    for (let j = 0; j < ops.fnArray.length; j++) {
      if (
        ops.fnArray[j] == pdfjs.OPS.paintJpegXObject ||
        ops.fnArray[j] == pdfjs.OPS.paintImageXObject
      ) {
        images.push({
          type: ops.fnArray[j],
          obj: page.objs.get(ops.argsArray[j][0])
        });
      }
    }

    if (images.length !== 1) {
      throw new Error(
        "Could not find a JPG image on this page or find too many"
      );
    }

    var svgGfx = new pdfjs.SVGGraphics(page.commonObjs, page.objs);

    const img = images[0];

    let renderedImage;
    switch (img.type) {
      case pdfjs.OPS.paintImageXObject:
        svgGfx.paintInlineImageXObject(img.obj, {
          appendChild: el => {
            renderedImage = el.attributes["xlink:href"].substring(22);
          }
        });
        break;
      case pdfjs.OPS.paintJpegXObject:
        renderedImage = img.obj.src.substring(23);
        break;
    }

    return {
      path: Buffer.from(renderedImage, "base64"),
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

    const command = [
      "convert",
      "-density",
      "400",
      `${filePath}[${page}]`,
      file.path
    ];

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
    const doc = await this.getDocument();

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
