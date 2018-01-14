const childProcess = require("child_process");

const PDFExtract = require("pdf.js-extract").PDFExtract;
const shellEscape = require("shell-escape");
const tmp = require("tmp");

const exec = childProcess.execSync;

function escape(input) {
  return shellEscape([input]);
}

module.exports = class PDFTools {
  constructor(file) {
    this.file = file;
  }

  extractPage(page) {
    const to = tmp.fileSync({ postfix: ".png" });

    exec(`convert ${escape(`${this.file}[${page}]`)} ${escape(to.name)}`, {
      encoding: "utf8"
    });

    return {
      file: to.name,
      cleanup: () => {
        to.removeCallback();
      }
    };
  }

  getImageSizes() {
    return new Promise((resolve, reject) => {
      var pdfExtract = new PDFExtract();
      pdfExtract.extract(
        this.file,
        {} /* options, currently nothing available*/,
        (err, data) => {
          if (err) {
            reject(err);
            return;
          }

          const pages = data.pages.map(page => {
            return {
              width: page.pageInfo.width,
              height: page.pageInfo.height
            };
          });

          resolve(pages);
        }
      );
    });
  }
};
