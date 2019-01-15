//@ts-check
const pathLib = require("path");

const tmp = require("tmp-promise");

const Compressed = require("./Compressed");
const { exec, escape, createTempSymlink } = require("../exec");

const options = { encoding: "utf8" };

// TODO :: investigate
// https://www.npmjs.com/package/node-stream-zip

module.exports = class Zip extends Compressed {
  async getFileNames() {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    const { stdout: filenames } = await exec(
      `zipinfo -1 ${escape(filePath)}`,
      options
    );

    cleanup();

    return filenames.split("\n");
  }

  async extractFile(file) {
    const { filePath, cleanup: cleanupSymlink } = await createTempSymlink(this.path);

    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    await exec(
      `unzip -p ${escape(filePath)} ${escape(file)} > ${escape(path)}`,
      options
    );

    cleanupSymlink()

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    await exec(
      `unzip ${escape(filePath)} -d ${escape(destination)}`,
      options
    );

    cleanup()
  }
};
