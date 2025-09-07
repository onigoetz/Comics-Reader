//@ts-check

import fs from "node:fs";
import path from "node:path";
import { cpus } from "node:os";

import createSymlink from "create-symlink";
import { execa } from "execa";
import tmp from "tmp-promise";
import debugFn from "debug";

import { createDeferred } from "./utils.js";

const debug = debugFn("comics:execQueue");

const processTimeout = 5000;
// unrar, unzip and friends is more I/O bound in general,
// however it still gives a rough indication of what the server might support.
// As we don't want this value to become too big, we're keeping it between 1 and 3
const maxProcess = Math.min(3, Math.max(1, Math.floor(cpus().length / 2)));

class Queue {
  constructor() {
    this.queue = [];
    this.inFlight = [];
  }

  async run(item) {
    debug("Running", item.cmd);
    const {
      cmd: [cmd, ...args],
      options: { stdoutFile, ...options },
      deferred
    } = item;

    const opts = {
      all: true,
      timeout: processTimeout,
      ...(options || {})
    };

    try {
      const subprocess = execa(cmd, args, opts);

      if (stdoutFile) {
        subprocess.stdout.pipe(fs.createWriteStream(stdoutFile));
      }

      const { stdout, stderr, all } = await subprocess;

      deferred.resolve({ stdout, stderr, all });
    } catch (err) {
      deferred.reject(err);
    }

    this.done(item);
  }

  add(item) {
    debug("Adding item", item.cmd);
    this.queue.unshift(item);
    this.next();
  }

  done(currentItem) {
    debug("Done", currentItem.cmd);

    // remove from inFlight list
    this.inFlight = this.inFlight.filter(item => item !== currentItem);

    this.next();
  }

  next() {
    // Don't start a new task if it already has the maximum
    if (this.inFlight.length >= maxProcess) {
      debug(
        `Max items inflight (${this.inFlight.length}), waiting (${this.queue.length} left in queue)`
      );
      return;
    }

    // Nothing left to do
    if (this.queue.length === 0) {
      debug("Queue empty");
      return;
    }

    // Get the first item from the queue, and run it
    const item = this.queue.pop();
    this.inFlight.push(item);

    this.run(item);
  }
}

const queue = new Queue();

/**
 * This exec method will not directly run the command, but will add it to a queue.
 * The queue will then execute each in turn, with a predefined maximum
 *
 * @param {string[]} cmd The command to run
 * @param {*} options Options for child_process.exec
 */
export function exec(cmd, options = {}) {
  const deferred = createDeferred();

  queue.add({ cmd, options, deferred });

  return deferred.promise;
}

/**
 * Temporary symlinks are used because some files can have accents in their names,
 * and using exec to unzip/unrar them might fail, I've seen it happen in docker mounted volumes
 * Creating a symlink to the files ensures the CLI only goes to a simple path and works reliably.
 *
 * @param {*} file
 */
export async function createTempSymlink(file) {
  var filePath = await tmp.tmpName({
    prefix: "symlink-",
    postfix: path.extname(file).toLowerCase()
  });

  await createSymlink(file, filePath);

  return {
    filePath,
    cleanup: () => {
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Could not delete ${filePath}: ${err}`);
        }
      });
    }
  };
}
