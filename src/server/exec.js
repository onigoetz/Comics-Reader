//@ts-check

const childProcess = require("child_process");

const shellEscape = require("shell-escape");
const debug = require("debug")("comics:execQueue");

const processTimeout = 5000;
// unrar, unzip and friends is more I/O bound in general,
// however it still gives a rough indication of what the server might support.
const maxProcess = Math.max(require('os').cpus().length - 1, 4);

function defer() {
  var deferred = {};
  var promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  deferred.promise = promise;
  return deferred;
}

class Queue {
  constructor() {
    this.queue = [];
    this.inFlight = [];
  }

  run(item) {
    debug("Running", item.cmd);
    const { cmd, options, deferred } = item;

    const opts = { timeout: processTimeout, ...options || {} };

    childProcess.exec(
      cmd,
      opts,
      (err, stdout, stderr) => {
        err
          ? deferred.reject(err)
          : deferred.resolve({
            stdout: stdout.toString("utf8"),
            stderr: stderr.toString("utf8")
          });

        this.done(item);
      }
    );
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
      debug(`Max items inflight (${this.inFlight.length}), waiting (${this.queue.length} left in queue)`);
      return;
    }

    // Nothing left to do
    if (this.queue.length == 0) {
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
 * @param {string} cmd The command to run
 * @param {*} opts Options for child_process.exec
 */
function exec(cmd, opts) {
  const options = opts || {};

  const deferred = defer();

  queue.add({cmd, options, deferred});

  return deferred.promise;
}

function escape(input) {
  return shellEscape([input]);
}

module.exports = {
  exec,
  escape
};
