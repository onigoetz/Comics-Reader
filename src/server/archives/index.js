const archiveType = require("archive-type");
const readChunk = require("read-chunk");

const Zip = require("./Zip");
const Rar = require("./Rar");

// TODO :: make async
module.exports = function open(path) {
  // Check with mime type, people tend to misname cbr/cbz files
  const buffer = readChunk.sync(path, 0, 262);
  const type = archiveType(buffer);

  switch (type.mime) {
    case "application/zip":
      return new Zip(path);
    case "application/x-rar-compressed":
      return new Rar(path);
    default:
      throw new Error(`Could not open archive of type ${type.mime}`);
  }
};
