const path = require("path");
const childProcess = require("child_process");

const shellEscape = require("shell-escape");
const tmp = require("tmp");

const options = { encoding: "utf8" };

function escape(input) {
  return shellEscape([input]);
}

module.exports = class Zip {
  constructor(filePath) {
    this.path = filePath;
  }

  getFileNames() {
    return childProcess
      .execSync(`zipinfo -1 ${escape(this.path)}`, options)
      .split("\n");
  }

  extractFile(file) {
    const to = tmp.fileSync({ postfix: path.extname(file).toLowerCase() });

    childProcess.execSync(
      `unzip -p ${escape(this.path)} ${escape(file)} > ${escape(to.name)}`,
      options
    );

    return {
      file: to.name,
      cleanup: () => {
        to.removeCallback();
      }
    };
  }

  extractTo(destination) {
    return childProcess.execSync(
      `unzip ${escape(this.path)} -d ${escape(destination)}`,
      options
    );
  }
};
