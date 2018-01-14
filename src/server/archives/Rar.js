const childProcess = require("child_process");
const path = require("path");

const shellEscape = require("shell-escape");
const tmp = require("tmp");

const exec = childProcess.execSync;
const options = { encoding: "utf8" };

function escape(input) {
  return shellEscape([input]);
}

/**
 * Documentation of the unrar command :
 * http://acritum.com/winrar/console-rar-manual
 */
module.exports = class Rar {
  constructor(filePath) {
    this.path = filePath;
  }

  extractTo(destination) {
    return exec(`unrar x ${escape(this.path)} ${escape(destination)}`, options);
  }

  extractFile(file) {
    const to = tmp.fileSync({ postfix: path.extname(file).toLowerCase() });

    exec(
      `unrar p -idq ${escape(this.path)} ${escape(file)} > ${escape(to.name)}`,
      options
    );

    return {
      file: to.name,
      cleanup: () => {
        to.removeCallback();
      }
    };
  }

  getFileNames() {
    return exec(`unrar lb ${escape(this.path)}`, options).split("\n");
  }
};
