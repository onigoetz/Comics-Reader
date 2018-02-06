const childProcess = require("child_process");

const PDFExtract = require("pdf.js-extract").PDFExtract;
const shellEscape = require("shell-escape");
const tmp = require("tmp");

function escape(input) {
  return shellEscape([input]);
}

const commandOptions = {
  encoding: "utf8"
};

function getTempFile() {
  return new Promise((resolve, reject) => {
    tmp.file({ postfix: ".png" }, (fileErr, file, fd, cleanup) => {
      if (fileErr) {
        reject(`Failed creating temp file: ${fileErr}`);
        return;
      }

      resolve({ file, cleanup });
    });
  });
}

module.exports = class PDFTools {
  constructor(file) {
    this.file = file;
  }

  extractPage(page) {
    return new Promise((resolve, reject) => {
      getTempFile().then(
        file => {
          const command = `convert ${escape(`${this.file}[${page}]`)} ${escape(
            file.file
          )}`;
          childProcess.exec(
            command,
            commandOptions,
            (error, stdout, stderr) => {
              if (error) {
                console.log(
                  "Failed extracting image:",
                  error,
                  "stderr",
                  stderr,
                  "stdout",
                  stdout
                );
                reject();
                return;
              }

              resolve(file);
            }
          );
        },
        fileError => {
          console.log(fileError);
          reject();
        }
      );
    });
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
