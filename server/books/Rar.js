//@ts-check
import pathLib from "path";

import tmp from "tmp-promise";

import Compressed from "./Compressed.js";
import { exec, createTempSymlink } from "../exec.js";

/**
 * Documentation of the unrar command :
 * http://acritum.com/winrar/console-rar-manual
 */

// TODO :: investigate alternative
// https://www.npmjs.com/package/@huanjiesm/nodeunrar
// https://www.npmjs.com/package/node-unrar-js
export default class Rar extends Compressed {
  async getFileNames() {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    const { stdout: filenames } = await exec(["unrar", "lb", filePath]);

    cleanup();

    return filenames.split("\n");
  }

  async extractFile(file) {
    const { filePath, cleanup: cleanupSymlink } = await createTempSymlink(
      this.path
    );

    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    await exec(["unrar", "p", "-idq", filePath, file], { stdoutFile: path });

    cleanupSymlink();

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    await exec(["unrar", "x", filePath, destination]);

    cleanup();
  }
};
