//@ts-check
const pathLib = require("path");

const tmp = require("tmp-promise");

const Compressed = require("./Compressed");
const { exec, escape } = require("../exec");

const options = { encoding: "utf8" };

module.exports = class Zip extends Compressed {
  async getFileNames() {
    const { stdout: filenames } = await exec(
      `zipinfo -1 ${escape(this.path)}`,
      options
    );
    return filenames.split("\n");
  }

  async extractFile(file) {
    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    await exec(
      `unzip -p ${escape(this.path)} ${escape(file)} > ${escape(path)}`,
      options
    );

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    return exec(
      `unzip ${escape(this.path)} -d ${escape(destination)}`,
      options
    );
  }
};
