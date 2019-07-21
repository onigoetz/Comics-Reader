//@ts-check

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const debug = require("debug")("comics:index");
const naturalSort = require("natural-sort")();

const cache = require("../cache");
const Node = require("./Node");
const RootNode = require("./RootNode");
const { getFileNames } = require("../books");
const { getValidImages, isDirectorySync, isDirectory } = require("../utils");
const GALLERY_ROOT = require("../../config.js").comics;

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Directories to ignore when listing output.
const ignore = ["cgi-bin", ".", "..", "cache", ".DS_Store", "Thumbs.db"];
const archives = [".cbr", ".cbz", ".zip", ".rar"];

function getDuration(start) {
  const end = new Date();
  return (end.getTime() - start.getTime()) / 1000;
}

module.exports = class IndexCreator {
  constructor(dirPath) {
    this.foundBooks = 0;
    this.dirPath = dirPath;
  }

  async generateList(dirPath = ".", parent = null) {
    debug(`Scanning '${dirPath.replace(this.dirPath, "")}'`);
    const directories = [];
    const maybeThumbnails = [];

    const files = await readdir(dirPath);

    const promises = files.map(async item => {
      const itemPath = path.join(dirPath, item);
      if (ignore.indexOf(item) !== -1) {
        return;
      }

      // Ignore hidden files
      if (item.indexOf(".") === 0) {
        return;
      }

      const isDir = await isDirectory(itemPath);
      const extension = path.extname(item).toLowerCase();

      if (isDir || extension === ".pdf" || archives.indexOf(extension) !== -1) {
        const node = new Node(item, parent);
        debug(`Found: ${node.getPath()}`);
        directories.push(node);
        this.foundBooks++;

        if (isDir) {
          node.setChildren(await this.generateList(itemPath, node));
        }
        return;
      }

      maybeThumbnails.push(item);
    });

    await Promise.all(promises);

    // If this folder contains images, but doesn't contain books
    // it's probably a book itself
    // So we'll get the thumbnail directly, instead of traversing it again later.
    if (maybeThumbnails.length > 0 && directories.length === 0) {
      parent.setThumb(this.getBestThumbnail(parent, maybeThumbnails));
    }

    return directories;
  }

  async getThumbnailInChild(node) {
    const extension = path.extname(node.getName()).toLowerCase();

    if (node.getThumb()) {
      return;
    }

    // A PDF file
    if (extension === ".pdf") {
      node.setThumb(`${node.getPath()}/1.png`);
      return;
    }

    // A zip / rar archive
    if (archives.indexOf(extension) !== -1) {
      try {
        node.setThumb(await this.getThumbFromArchive(node));
      } catch (e) {
        console.error(`Could not open archive: ${node.getPath()} (${e})`);
      }

      return;
    }

    // A normal directory
    if (node.getChildren()) {
      await this.getThumbnails(node);
      node.setThumb(await this.getThumbForDirectory(node));
      return;
    }

    console.error(`Could not find a thumb for ${node.getPath()}`);
  }

  async getThumbnails(dir) {
    const children = dir.getChildren();

    if (!children) {
      return;
    }

    const promises = children.map(node => this.getThumbnailInChild(node));

    await Promise.all(promises);
  }

  async getRootNode() {
    const root = new RootNode("Home");

    let start = new Date();
    root.setChildren(await this.generateList(this.dirPath));
    console.log(
      `Found ${this.foundBooks} books and directories in ${getDuration(
        start
      )} s`
    );

    start = new Date();
    await this.getThumbnails(root);
    console.log(`Computed thumbnails in ${getDuration(start)} s`);

    return root;
  }

  async getList() {
    if (!this.rootNode) {
      this.rootNode = this.getRootNode();
    }

    return this.rootNode;
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
   * Get the cache key
   *
   * @param {Node} node The node to get the thumbnail from
   * @return {Promise<string>} The path to a thumbnail or false
   */
  async getCacheKey(node) {
    const cacheKeyVersion = 1;
    const fileStat = await stat(`${GALLERY_ROOT}/${node.getPath()}`);
    return `thumb:${cacheKeyVersion}:${node.getPath()}:${fileStat.size}:${
      fileStat.mtimeMs
    }`;
  }

  /**
   * Get the thumbnail for an archive
   *
   * @param {Node} node The node to get the thumbnail from
   * @return {Promise<boolean|string>} The path to a thumbnail or false
   */
  async getThumbFromArchive(node) {
    const cacheKey = await this.getCacheKey(node);

    try {
      return await cache.wrap(cacheKey, async () => {
        const fileNames = await getFileNames(`${GALLERY_ROOT}/${node.getPath()}`);
  
        if (fileNames) {
          return this.getBestThumbnail(node, fileNames);
        } else {
          throw new Error(`Could not open archive ${node.getPath()}`);
        }
      });
    } catch (e) {
      console.error(e.message);
    }

    console.error(`Failed on ${node.getPath()}`);
    return false;
  }

  async getThumbForDirectory(folder) {
    const item = folder.getChildren().find(child => child.getThumb());

    if (!item) {
      console.error(`Could not find thumb for ${folder.getPath()}`);
      return false;
    }

    return item.getThumb();
  }
};
