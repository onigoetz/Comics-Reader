//@ts-check
const pathLib = require("path");
const fs = require("fs");

const unzipper = require("unzipper");
const tmp = require("tmp-promise");

const Compressed = require("./Compressed");
const { ensureDir } = require("../utils");

module.exports = class Zip extends Compressed {
  async getFileNames() {
    const filenames = [];

    await fs.createReadStream(this.path)
      .pipe(unzipper.Parse())
      .on("error", e => {
        console.log(e, "omagaaad");
      })
      .on("entry", entry => {
        debug && console.log(entry.path);
        if (entry.type === "File") {
          filenames.push(entry.path);
        }
        entry.autodrain();
      })
      .on("error", e => {
        console.log(e, "omagaaad");
      })
      .promise();

    active = active.filter(item => item !== this.path);

    console.log("active", active.length);

    if (active.length < 5) {
      console.log(active);
    }

    return filenames;
  }

  async extractFile(file) {

    console.log("Extracting file");

    const { path, cleanup } = await tmp.file({
      postfix: pathLib.extname(file).toLowerCase()
    });

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

  async extractAll(destination) {

    console.log("Extracting all");

    return fs.createReadStream(this.path)
      .pipe(unzipper.Parse())
      .on("entry", async entry => {
        const finalPath = pathLib.join(destination, entry.path);
        if (entry.type === "Directory") {
          await ensureDir(finalPath);
          entry.autodrain()
        } else {
          entry.pipe(fs.createWriteStream(finalPath));
        }        
      })
      .promise();
  }
};
