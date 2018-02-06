const fs = require("fs");
const path = require("path");

const naturalSort = require("node-natural-sort")();

const Node = require("./Node");
const RootNode = require("./RootNode");
const openArchive = require("../archives");
const { getValidImages, isDirectory } = require("../utils");
const GALLERY_ROOT = require("../../../config.js").comics;

module.exports = class IndexCreator {
  constructor(dirPath, verbose = false) {
    this.verbose = verbose;
    this.list = this.generateList(dirPath);
  }

  log(text) {
    if (this.verbose) {
      console.log(text);
    }
  }

  generateList(dirPath = ".", parent = null) {
    this.log(`Looking for books in '${dirPath}'`);
    const directories = [];

    // Directories to ignore when listing output.
    const ignore = ["cgi-bin", ".", "..", "cache"];
    const archives = [".cbr", ".cbz", ".zip", ".rar"];

    fs.readdirSync(dirPath).forEach(item => {
      const itemPath = path.join(dirPath, item);
      if (ignore.indexOf(item) !== -1) {
        return;
      }

      // A normal directory
      if (isDirectory(itemPath)) {
        this.log(`  Found book or directory: ${item}`);
        const node = new Node(item, parent);
        node.setChildren(this.generateList(itemPath, node));
        node.setThumb(this.getThumb(node));
        directories.push(node);
        return;
      }

      // A zip / rar archive
      if (archives.indexOf(path.extname(item)) !== -1) {
        try {
          this.log(`  Found compressed book: ${item}`);
          const node = new Node(item, parent);
          node.setThumb(this.getThumb(node));
          directories.push(node);
        } catch ($e) {
          this.log("Could not open archive: ".item);
        }
      }

      // a PDF file
      if (path.extname(item).toLowerCase() === ".pdf") {
        this.log(`  Found pdf: ${item}`);
        const node = new Node(item, parent);
        node.setThumb(`${node.getPath()}/1.png`);
        directories.push(node);
      }
    });

    return directories;
  }

  getList() {
    const root = new RootNode("Home");
    root.setChildren(this.list);
    return root;
  }

  getNode(node) {
    const foundNode = this.getList().getNode(node);

    if (!foundNode) {
      return Promise.reject(foundNode);
    }

    return Promise.resolve(foundNode);
  }

  /**
   * From a list of files, take the best suited to be the thumbnail
   *
   * @param {Node} folder The node to get the thumbnail from
   * @param {string[]} files The files to choose from
   * @return {bool|string} The path to a thumbnail or false
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
   * @return {bool|string} The path to a thumbnail or false
   */
  getThumbFromDirectory(folder) {
    const files = fs
      .readdirSync(`${GALLERY_ROOT}/${folder.getPath()}`)
      .filter(
        item =>
          item.substring(0, 1) !== "." &&
          !isDirectory(`${GALLERY_ROOT}/${folder.getPath()}/${item}`)
      );

    return this.getBestThumbnail(folder, files);
  }

  /**
   * Get the thumbnail for an archive
   *
   * @param {Node} node The node to get the thumbnail from
   * @return {bool|string} The path to a thumbnail or false
   */
  getThumbFromArchive(node) {
    try {
      const archive = openArchive(`${GALLERY_ROOT}/${node.getPath()}`);

      if (archive) {
        return this.getBestThumbnail(node, archive.getFileNames());
      } else {
        this.log("    could not open archive");
      }
    } catch (e) {
      this.log(e.message);
    }

    this.log(`Failed on ${node.getPath()}`);
    return false;
  }

  getThumb(folder) {
    if (folder.getType() === "tome") {
      if (isDirectory(`${GALLERY_ROOT}/${folder.getPath()}`)) {
        return this.getThumbFromDirectory(folder);
      }

      return this.getThumbFromArchive(folder);
    }

    // If we're in a directory, get its
    // own children to give the thumbnail
    const item = folder.getChildren().find(child => child.getThumb());

    if (!item) {
      this.log(`Could not find thumb for ${folder.getName()}`);
      return false;
    }

    return item.getThumb();
  }

  // TODO :: remove ?
  static unserialize(cache, parent = null) {
    return cache.map(item => {
      const node = new Node(item.name, parent);
      node.setThumb(item.thumb);
      node.setChildren(IndexCreator.fromCache(item.children, node));

      return node;
    });
  }

  static serialize(nodes) {
    return nodes.map(node => ({
      name: node.getName(),
      thumb: node.getThumb(),
      children: IndexCreator.toCache(node.getChildren())
    }));
  }
};
