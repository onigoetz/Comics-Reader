//@ts-check
const pathLib = require("path");
const fs = require("fs");

const unzipper = require("unzipper");
const tmp = require("tmp-promise");

const Compressed = require("./Compressed");
const { exec, escape } = require("../exec");
const { ensureDir } = require("../utils");

function promiseTimeout(ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.')
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ])
}

const outerTimeout = 60000;
const innerTimeout = 5000;

const execOptions = { encoding: "utf8" };

module.exports = class Zip extends Compressed {

  _node_getFileNames() {
    return new Promise(async (resolve, reject) => {
      let timeoutId;

      const filenames = []
      await fs.createReadStream(this.path)
        .pipe(unzipper.Parse())
        .on("entry", entry => {
          filenames.push(entry.path);
          entry.autodrain();

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          // We're setting a timeout, will fail if the stream stops unexpectedly in the middle
          // We're starting it here as we don't know exactly when the stream starts treating the files
          // This ensures we give a faire chance to actually get to the files if there are a lot of comics to analyze
          timeoutId = setTimeout(() => {
            reject(`No new entry in stream for ${innerTimeout}ms, it's probably stuck`);
          }, innerTimeout)
        })
        .promise()

      clearTimeout(timeoutId);

      resolve(filenames);
    });
  }

  async _exec_getFileNames() {
    const { stdout: filenames } = await exec(
      `zipinfo -1 ${escape(this.path)}`,
      execOptions
    )

    return filenames.split("\n");
  }

  async getFileNames() {
    console.log(`ZIP: ${this.path}`)
    try {
      return await promiseTimeout(outerTimeout, this._node_getFileNames());
    } catch (e) {
      console.error(`Failed retrieving filenames, for "${this.path}", retrying through unzip command, original error: ${e}`)
    }

    return await this._exec_getFileNames();
  }

  async _node_extractFile(file, path, cleanup) {
    await fs.createReadStream(this.path)
      .pipe(unzipper.Parse())
      .on("entry", entry => {
        if (entry.path === file) {
          entry.pipe(fs.createWriteStream(path));
        } else {
          entry.autodrain();
        }
      })
      .promise();

    return {
      path,
      cleanup
    };
  }

  async _exec_extractFile(file, path, cleanup) {
    await exec(
      `unzip -p ${escape(this.path)} ${escape(file)} > ${escape(path)}`,
      execOptions
    );

    return {
      path,
      cleanup
    };
  }

  async extractFile(file) {
    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

    try {
      return await this._node_extractFile(file, path, cleanup);
    } catch (e) {
      console.error(`Failed extracting file, for "${this.path}", retrying through unzip command, original error: ${e}`)
    }

    return await this._exec_extractFile(file);
  }

  async _node_extractAll(destination) {
    return fs.createReadStream(this.path)
      .pipe(unzipper.Parse())
      .on("entry", async entry => {
        const finalPath = pathLib.join(destination, entry.path);
        if (entry.type === "File") {
          await ensureDir(pathLib.dirname(finalPath));
          entry.pipe(fs.createWriteStream(finalPath));
        }
      })
      .promise();
  }

  async _exec_extractAll(destination) {
    return exec(
      `unzip ${escape(this.path)} -d ${escape(destination)}`,
      execOptions
    );
  }

  async extractAll(destination) {
    console.log("Extracting all");

    try {
      return await this._node_extractAll(destination);
    } catch (e) {
      console.error(`Failed extracting all files, for "${this.path}", retrying through unzip command, original error: ${e}`)
    }

    return await this._exec_extractAll(destination);
  }
};
