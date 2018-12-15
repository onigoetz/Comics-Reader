//@ts-check
const pathLib = require("path");

const tmp = require("tmp-promise");

const Compressed = require("./Compressed");
const { exec, escape } = require("../exec");

/**
 * Documentation of the unrar command :
 * http://acritum.com/winrar/console-rar-manual
 */

 // TODO :: investigate alternative
 // https://www.npmjs.com/package/@huanjiesm/nodeunrar
 // https://www.npmjs.com/package/node-unrar-js
module.exports = class Rar extends Compressed {
  async getFileNames() {
    const { stdout: filenames } = await exec(`unrar lb ${escape(this.path)}`);

    return filenames.split("\n");
  }

  async extractFile(file) {
    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    await exec(
      `unrar p -idq ${escape(this.path)} ${escape(file)} > ${escape(path)}`
    );

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    return exec(`unrar x ${escape(this.path)} ${escape(destination)}`);
  }
};
