//@ts-check
const pathLib = require("path");

const tmp = require("tmp-promise");

const Compressed = require("./Compressed");
const { exec, escape, createTempSymlink } = require("../exec");

/**
 * Documentation of the unrar command :
 * http://acritum.com/winrar/console-rar-manual
 */

// TODO :: investigate alternative
// https://www.npmjs.com/package/@huanjiesm/nodeunrar
// https://www.npmjs.com/package/node-unrar-js
module.exports = class Rar extends Compressed {
  async getFileNames() {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    const { stdout: filenames } = await exec(`unrar lb ${escape(filePath)}`);

    cleanup();

    return filenames.split("\n");
  }

  async extractFile(file) {
    const { filePath, cleanup: cleanupSymlink } = await createTempSymlink(this.path);

    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    await exec(
      `unrar p -idq ${escape(filePath)} ${escape(file)} > ${escape(path)}`
    );

    cleanupSymlink();

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    await exec(`unrar x ${escape(filePath)} ${escape(destination)}`);

    cleanup();
  }
};
