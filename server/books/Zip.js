//@ts-check
import pathLib from "path";
import fs from "fs";

import unzipper from "unzipper";
import tmp from "tmp-promise";
import { Iconv } from "iconv";
import { timeout as promiseTimeout } from "promise-timeout";

import Compressed from "./Compressed.js";
import { exec, createTempSymlink } from "../exec.js";

const iconv = new Iconv("UTF-8", "UTF-8//IGNORE");

function cleanupName(nameBuffer) {
  return iconv.convert(nameBuffer).toString("utf8");
}

function getPath({ path, isUnicode, pathBuffer }) {
  // if some legacy zip tool follow ZIP spec then this flag will be set
  return isUnicode ? path : cleanupName(pathBuffer);
}

const outerTimeout = 15000;

const failedFiles = new Set();

const options = { encoding: "utf8" };

class NodeZip {
  constructor(filePath) {
    this.path = filePath;
  }

  async openFile() {
    return unzipper.Open.file(this.path);
  }

  async getFileNames() {
    const directory = await this.openFile();
    return directory.files.map(entry => getPath(entry));
  }

  async extractFile(file) {
    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    const directory = await this.openFile();
    const entry = directory.files.find(
      currentFile => getPath(currentFile) === file
    );

    if (!entry) {
      throw new Error(`${file} not found in ${this.path}`);
    }

    await new Promise((resolve, reject) => {
      entry
        .stream()
        .pipe(fs.createWriteStream(path))
        .on("error", reject)
        .on("finish", resolve);
    });

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    const directory = await this.openFile();
    return directory.extract({ path: destination });
  }
}

class ExecZip {
  constructor(filePath) {
    this.path = filePath;
  }

  async getFileNames() {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    const { stdout: filenames } = await exec(
      ["zipinfo", "-1", filePath],
      options
    );

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

    await exec(["unzip", "-p", filePath, file], {
      ...options,
      stdoutFile: path
    });

    cleanupSymlink();

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    await exec(["unzip", "-o", filePath, "-d", destination], options);

    cleanup();
  }
}

export default class Zip extends Compressed {
  constructor(filePath) {
    super(filePath);

    this.exec = new ExecZip(filePath);
    this.node = new NodeZip(filePath);
  }

  async runExec(fn, args) {
    return this.exec[fn](...args);
  }

  async runNode(fn, args) {
    return promiseTimeout(this.node[fn](...args), outerTimeout);
  }

  async run(fn, ...args) {
    if (failedFiles.has(this.path)) {
      return this.runExec(fn, args);
    }

    try {
      return await this.runNode(fn, args);
    } catch (e) {
      failedFiles.add(this.path);
      console.error(
        `Failed to run '${fn}', for '${this.path}', retrying through unzip command, original error: ${e}`
      );
    }

    return this.runExec(fn, args);
  }

  async getFileNames() {
    return this.run("getFileNames");
  }

  async extractFile(file) {
    return this.run("extractFile", file);
  }

  async extractAll(destination) {
    return this.run("extractAll", destination);
  }
};
