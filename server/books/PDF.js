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

  async extractPageWithLib(pageNum) {
    const doc = await this.getDocument();

    const page = await doc.getPage(pageNum);
    const ops = await page.getOperatorList();
    const images = [];

    for (let j = 0; j < ops.fnArray.length; j++) {
      if (
        ops.fnArray[j] === pdfjs.OPS.paintJpegXObject ||
        ops.fnArray[j] === pdfjs.OPS.paintImageXObject
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

    // It would be better to keep it as a buffer
    // But libraries like image-size can't deal with it
    const file = await tmp.file({ postfix: ".png" });
    await fs.promises.writeFile(
      file.path,
      Buffer.from(renderedImage, "base64")
    );

    return file;
  }

  async extractPage(pageNum) {
    try {
      // We must await here otherwise the error will bubble up
      return await this.extractPageWithLib(pageNum);
    } catch (e) {
      console.error(`Could not extract file ${e.message}`);
    }

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
