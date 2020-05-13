//@ts-check

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const Table = require("cli-table");
const percentile = require("percentile");

const debug = require("debug")("comics:index");

const cache = require("../cache");
const { TYPE_DIR, TYPE_BOOK } = require("./types");
const Node = require("./Node");
const RootNode = require("./RootNode");
const Walker = require("./Walker");
const { getFileNames } = require("../books");
const { getValidImages, isDirectory, sortNaturally } = require("../utils");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Directories to ignore when listing output.
const ignore = ["cgi-bin", ".", "..", "cache", ".DS_Store", "Thumbs.db"];
const archives = [".cbr", ".cbz", ".zip", ".rar"];

function getDuration(start) {
  const end = new Date();
  return (end.getTime() - start.getTime()) / 1000;
}

function forEachAsync(items, cb) {
  return items.reduce(async (previous, node) => {
    await previous;
    return cb(node);
  }, Promise.resolve());
}

module.exports = class IndexCreator {
  constructor(dirPath) {
    this.foundBooks = 0;
    this.foundThumbs = 0;
    this.dirPath = dirPath;
    this.isReady = false;
    this.phase = "NONE";
    this.errors = [];
    this.stats = [];
  }

  addStat(type, start) {
    const hrend = process.hrtime(start);

    // get in ms
    const duration = hrend[0] * 1000 + hrend[1] / 1000000;
    this.stats.push({ type, duration });
  }

  async generateList(dirPath = ".", parent = null) {
    debug(`Scanning '${dirPath.replace(this.dirPath, "")}'`);
    const directories = [];
    const maybeThumbnails = [];

    const hrstart = process.hrtime();
    const files = await readdir(dirPath);

    await forEachAsync(files, async item => {
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
        const node = new Node(item, parent, isDir ? TYPE_DIR : TYPE_BOOK);
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

    // If this folder contains images, but doesn't contain books
    // it's probably a book itself
    // So we'll get the thumbnail directly, instead of traversing it again later.
    if (maybeThumbnails.length > 0 && directories.length === 0) {
      parent.setType(TYPE_BOOK);
      parent.setThumb(this.getBestThumbnail(parent, maybeThumbnails));
      this.addStat("Dir", hrstart);
      this.foundThumbs++;
    }

    return directories;
  }

  async getThumbnailInChild(node) {
    const extension = path.extname(node.getName()).toLowerCase();

    if (node.getThumb()) {
      return;
    }

    const hrstart = process.hrtime();

    // A PDF file
    if (extension === ".pdf") {
      node.setThumb(`${node.getPath()}/1.png`);
      this.addStat("PDF", hrstart);
      this.foundThumbs++;
      return;
    }

    // A zip / rar archive
    if (archives.indexOf(extension) !== -1) {
      try {
        node.setThumb(await this.getThumbFromArchive(node));
        this.addStat(extension.replace(".", ""), hrstart);
        this.foundThumbs++;
      } catch (e) {
        console.error(`Could not open archive: ${node.getPath()} (${e})`);
      }

      return;
    }

    // A normal directory
    if (node.getChildren()) {
      await this.getThumbnails(node);
      node.setThumb(await this.getThumbForDirectory(node));
      this.foundThumbs++;
      return;
    }

    console.error(`Could not find a thumb for ${node.getPath()}`);
  }

  async getThumbnails(dir) {
    const children = dir.getChildren();

    if (!children) {
      return;
    }

    await forEachAsync(children, async node => this.getThumbnailInChild(node));
  }

  writeStats() {
    const table = new Table({
      head: ["Type", "Books", "Average Duration", "Median", "95th Percentile"]
    });

    const keys = this.stats
      .map(item => item.type)
      .filter((value, index, self) => self.indexOf(value) === index);

    const addRow = (key, items) => {
      const durations = items.map(item => item.duration);
      const total = durations.reduce((a, b) => a + b, 0);

      table.push([
        key,
        items.length,
        `${(total / durations.length).toFixed(2)} ms`,
        `${percentile(50, durations).toFixed(2)} ms`,
        `${percentile(95, durations).toFixed(2)} ms`
      ]);
    };

    keys.forEach(key => {
      const items = this.stats.filter(item => item.type === key);
      addRow(key, items);
    });

    addRow("All", this.stats);

    console.log(table.toString());
  }

  async getRootNode() {
    const root = new RootNode("Home", null, TYPE_DIR);

    this.phase = "SCAN";
    let start = new Date();
    root.setChildren(await this.generateList(this.dirPath, root));
    console.log(
      `Found ${this.foundBooks} books or directories in ${getDuration(start)} s`
    );

    console.log(`Found ${this.foundThumbs} thumbnails already`);

    start = new Date();
    this.phase = "THUMBS";
    await this.getThumbnails(root);
    console.log(`Computed thumbnails in ${getDuration(start)} s`);

    root.removeEmptyDirs();

    this.phase = "DONE";
    this.isReady = true;

    this.walker = new Walker(root);

    this.writeStats();

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

    // Instead of sorting the list, we do a one pass sorting by always keeping the smaller item.
    // Similar to Math.min / Math.max
    const thumbnail = images.reduce((previous, current) => {
      if (previous == null) {
        return current;
      }
      return sortNaturally(current, previous) === 1 ? previous : current;
    }, null);

    return `${folder.getPath()}/${thumbnail}`;
  }

  /**
   * Get the cache key
   *
   * @param {Node} node The node to get the thumbnail from
   * @return {Promise<string>} The path to a thumbnail or false
   */
  async getCacheKey(node) {
    const cacheKeyVersion = 1;
    const fileStat = await stat(`${process.env.DIR_COMICS}/${node.getPath()}`);
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
        const fileNames = await getFileNames(
          `${process.env.DIR_COMICS}/${node.getPath()}`
        );

        if (fileNames) {
          return this.getBestThumbnail(node, fileNames);
        } else {
          throw new Error(`Could not open archive ${node.getPath()}`);
        }
      });
    } catch (e) {
      this.errors.push([
        node.getPath(),
        {
          message: e.message,
          stack: e.all ? `${e.all}\n\n${e.stack}` : e.stack
        }
      ]);
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
