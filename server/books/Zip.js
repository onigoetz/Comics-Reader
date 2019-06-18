//@ts-check
const pathLib = require("path");
const fs = require("fs");

const unzipper = require("unzipper");
const tmp = require("tmp-promise");
const Iconv = require("iconv").Iconv;

const Compressed = require("./Compressed");
const { exec, escape, createTempSymlink } = require("../exec");
const { ensureDir } = require("../utils");

const iconv = new Iconv("UTF-8", "UTF-8//IGNORE");

function cleanupName(nameBuffer) {
  return iconv.convert(nameBuffer).toString("utf8");
}

function promiseTimeout(ms, promise) {
  let killTimeout = function() {};

  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    killTimeout = () => {
      clearTimeout(id);
      resolve("Killed timeout");
    };

    let id = setTimeout(() => {
      clearTimeout(id);
      reject(`Timed out in ${ms}ms.`);
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]).then(val => {
    killTimeout();
    return val;
  });
}

const outerTimeout = 60000;
const innerTimeout = 5000;

const options = { encoding: "utf8" };

class NodeZip {
  constructor(filePath) {
    this.path = filePath;
  }

  readStream(fn) {
    return fs
      .createReadStream(this.path)
      .pipe(unzipper.Parse())
      .on("entry", async entry => {
        // if some legacy zip tool follow ZIP spec then this flag will be set
        const isUnicode = entry.props.flags.isUnicode;

        let fileName = entry.path;

        if (!isUnicode) {
          fileName = cleanupName(entry.props.pathBuffer);
        }

        return await fn(entry, fileName);
      })
      .promise();
  }

  async getFileNames() {
    return new Promise(async (resolve, reject) => {
      let timeoutId;

      const filenames = [];
      await this.readStream(async (entry, fileName) => {
        filenames.push(fileName);
        await entry
          .autodrain()
          .on("error", e => console.error("Draining failed", e));

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // We're setting a timeout, will fail if the stream stops unexpectedly in the middle
        // We're starting it here as we don't know exactly when the stream starts treating the files
        // This ensures we give a faire chance to actually get to the files if there are a lot of comics to analyze
        timeoutId = setTimeout(() => {
          reject(
            `No new entry in stream for ${innerTimeout}ms, it's probably stuck`
          );
        }, innerTimeout);
      });

      clearTimeout(timeoutId);

      resolve(filenames);
    });
  }

  async extractFile(file, path, cleanup) {
    await this.readStream((entry, fileName) => {
      if (fileName === file) {
        entry.pipe(fs.createWriteStream(path));
      } else {
        entry.autodrain();
      }
    });

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    return await this.readStream(async (entry, fileName) => {
      const finalPath = pathLib.join(destination, fileName);
      if (entry.type === "File") {
        await ensureDir(pathLib.dirname(finalPath));
        entry.pipe(fs.createWriteStream(finalPath));
      }
    });
  }
}

class ExecZip {
  constructor(filePath) {
    this.path = filePath;
  }

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
    const { filePath, cleanup: cleanupSymlink } = await createTempSymlink(
      this.path
    );

    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    await exec(
      `unzip -p ${escape(filePath)} ${escape(file)} > ${escape(path)}`,
      options
    );

    cleanupSymlink();

    return {
      path,
      cleanup
    };
  }

  async extractAll(destination) {
    const { filePath, cleanup } = await createTempSymlink(this.path);

    await exec(`unzip ${escape(filePath)} -d ${escape(destination)}`, options);

    cleanup();
  }
}

module.exports = class Zip extends Compressed {
  constructor(filePath) {
    super(filePath);

    this.exec = new ExecZip(filePath);
    this.node = new NodeZip(filePath);
  }

  async getFileNames() {
    console.log(`ZIP: ${this.path}`);
    try {
      return await promiseTimeout(outerTimeout, this.node.getFileNames());
    } catch (e) {
      console.error(
        `Failed retrieving filenames, for "${
          this.path
        }", retrying through unzip command, original error: ${e}`
      );
    }

    return await this.exec.getFileNames();
  }

  async extractFile(file) {
    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    try {
      return await this.node.extractFile(file, path, cleanup);
    } catch (e) {
      console.error(
        `Failed extracting file, for "${
          this.path
        }", retrying through unzip command, original error: ${e}`
      );
    }

    return await this.exec.extractFile(file);
  }

  async extractAll(destination) {
    console.log("Extracting all");

    try {
      return await this.node.extractAll(destination);
    } catch (e) {
      console.error(
        `Failed extracting all files, for "${
          this.path
        }", retrying through unzip command, original error: ${e}`
      );
    }

    return await this.exec.extractAll(destination);
  }
};
