//@ts-check

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const debug = require('debug')('comics:index');
const naturalSort = require("natural-sort")();

const Node = require("./Node");
const RootNode = require("./RootNode");
const { getFileNames } = require("../books");
const { getValidImages, isDirectorySync, isDirectory } = require("../utils");
const GALLERY_ROOT = require("../../../config.js").comics;

const readdir = promisify(fs.readdir);

module.exports = class IndexCreator {
  constructor(dirPath) {
    this.foundBooks = 0;
    this.dirPath = dirPath;
  }

  async generateList(dirPath = ".", parent = null) {
    debug(`Scanning '${dirPath.replace(this.dirPath, "")}'`);
    const directories = [];

    // Directories to ignore when listing output.
    const ignore = ["cgi-bin", ".", "..", "cache"];
    const archives = [".cbr", ".cbz", ".zip", ".rar"];

    const files = await readdir(dirPath);

    const promises = files.map(async item => {
      const itemPath = path.join(dirPath, item);
      if (ignore.indexOf(item) !== -1) {
        return;
      }

      // Ignore files starting with ._ (macOS metadata files)
      if (item.indexOf("._") === 0) {
        return;
      }

      // A normal directory
      if (await isDirectory(itemPath)) {
        const node = new Node(item, parent);
        debug(`Found book or directory: ${node.getPath()}`);
        node.setChildren(await this.generateList(itemPath, node));
        node.setThumb(await this.getThumb(node));
        directories.push(node);
        this.foundBooks++;
        return;
      }

      const extension = path.extname(item).toLowerCase();

      // A PDF file
      if (extension === ".pdf") {
        const node = new Node(item, parent);
        debug(`Found book: ${node.getPath()}`);
        node.setThumb(`${node.getPath()}/1.png`);
        directories.push(node);
        this.foundBooks++;
        return;
      }

      // A zip / rar archive
      if (archives.indexOf(extension) !== -1) {
        try {
          const node = new Node(item, parent);
          debug(`Found book: ${node.getPath()}`);
          node.setThumb(await this.getThumb(node));
          directories.push(node);
          this.foundBooks++;
        } catch ($e) {
          console.error(`Could not open archive: ${item}`);
        }
      }
    });

    await Promise.all(promises);

    return directories;
  }

  async getList() {
    // TODO :: ensure the list isn't generated mutliple times
    if (!this.list) {
      this.list = await this.generateList(this.dirPath);
    }

    const root = new RootNode("Home");
    root.setChildren(this.list);

    console.log(`Found ${this.foundBooks} books and directories`);

    return root;
  }

  async getNode(node) {
    const list = await this.getList();
    return list.getNode(node);
  }

  /**
   * From a list of files, take the best suited to be the thumbnail
   *
   * @param {Node} folder The node to get the thumbnail from
   * @param {string[]} files The files to choose from
   * @return {boolean|string} The path to a thumbnail or false
   */
  getBestThumbnail(folder, files) {
    const images = getValidImages(files);

    if (!images.length) {
      return false;
    }

    return `${folder.getPath()}/${images.sort(naturalSort)[0]}`;
  }

  /**
   * Get the thumbnail for a directory
   *
   * @param {Node} folder The node to get the thumbnail from
   * @return {boolean|string} The path to a thumbnail or false
   */
  getThumbFromDirectory(folder) {
    const files = fs
      .readdirSync(`${GALLERY_ROOT}/${folder.getPath()}`)
      .filter(
        item =>
          item.substring(0, 1) !== "." &&
          !isDirectorySync(`${GALLERY_ROOT}/${folder.getPath()}/${item}`)
      );

    return this.getBestThumbnail(folder, files);
  }

  /**
   * Get the thumbnail for an archive
   *
   * @param {Node} node The node to get the thumbnail from
   * @return {Promise<boolean|string>} The path to a thumbnail or false
   */
  async getThumbFromArchive(node) {
    try {
      const fileNames = await getFileNames(`${GALLERY_ROOT}/${node.getPath()}`);

      if (fileNames) {
        return this.getBestThumbnail(node, fileNames);
      } else {
        console.error(`Could not open archive ${node.getPath()}`);
      }
    } catch (e) {
      console.error(e.message);
    }

    console.error(`Failed on ${node.getPath()}`);
    return false;
  }

  async getThumb(folder) {
    if (folder.getType() === "tome") {
      if (await isDirectory(`${GALLERY_ROOT}/${folder.getPath()}`)) {
        return this.getThumbFromDirectory(folder);
      }

      return this.getThumbFromArchive(folder);
    }

    // If we're in a directory, get its
    // own children to give the thumbnail
    const item = folder.getChildren().find(child => child.getThumb());

    if (!item) {
      console.error(`Could not find thumb for ${folder.getPath()}`);
      return false;
    }

    return item.getThumb();
  }
};
