import debugFn from "debug";

const debug = debugFn("comics:batchWorker");

import { createDeferred } from "./utils.js";

// As we're doing things in-memory we can deal with more things in parallel than spawning threads
// but let's not create too many items
const maxProcess = 10;

/**
 * This batch worker will group tasks related to the same file to be executed at once.
 * It's intented to be used with compressed files where the file should be opened once, and multiple files read from it.
 * Usually browsers open max 6 requests in parallel to the server
 * This means that most of the time max 6 actions will be batched for a single user
 * But in my limited benchmarks this is already a nice performance improvement
 */
export default class BatchWorker {
  constructor() {
    this.queue = [];
    this.inFlight = [];
  }

  async run(item) {
    debug("Running", item);

    try {
      /* eslint-disable-next-line new-cap */
      const batchClass = new item.batchClass();
      const openFile = await batchClass.read(item.path);

      // The file is open, we can't put more tasks in it
      item.isOpen = true;

      await batchClass.run(openFile, item.actions);
    } catch (err) {
      item.actions.forEach(action => {
        try {
          action.deferred.reject(err);
        } catch (err2) {
          console.error("Could not reject deferred", err2);
        }
      });
    }

    this.done(item);
  }

  next() {
    // Don't start a new task if it already has the maximum
    if (this.inFlight.length >= maxProcess) {
      debug(
        `Max items inflight (${this.inFlight.length}), waiting (${this.queue.length} left in queue)`
      );
      return;
    }

    const item = this.queue.find(currentItem => !currentItem.started);

    // Nothing left to do
    if (item === undefined) {
      debug("Queue empty");
      return;
    }

    // Get the first item from the queue, and run it
    item.started = true;
    this.inFlight.push(item);

    process.nextTick(() => {
      this.run(item);
    });
  }

  done(currentItem) {
    debug("Done", currentItem);

    // remove from inFlight list
    this.inFlight = this.inFlight.filter(item => item !== currentItem);
    this.queue = this.queue.filter(item => item !== currentItem);

    this.next();
  }

  /**
   * Add a task, receive a promise that will resolve once the task is done
   * @param {string} path File path to open
   * @param {Class} batchClass An asynchronous function to open the file
   * @param {Object} action The action to execute once the file is opened
   * @returns {Promise}
   */
  addTask(path, batchClass, action) {
    debug("Adding item", path, batchClass, action);

    const deferred = createDeferred();

    let item = this.queue.find(
      currentItem =>
        currentItem.isOpen === false &&
        currentItem.path === path &&
        currentItem.batchClass === batchClass
    );

    if (!item) {
      item = {
        path,
        batchClass,
        started: false, // Once the item is picked from the queue, started is set to true but the element isn't immediately removed, this allows to add more elements to the batch as long as the file isn't opened
        isOpen: false, // Once the file is opened, we pass the actions to the batch instance, at this point we don't want to add more elements to the batch
        actions: []
      };
      this.queue.push(item);
    }

    // We assign a deferred to the action
    // This will allow the "addTask" to resolve when the action is finished
    action.deferred = deferred;

    item.actions.push(action);

    this.next();

    return deferred.promise;
  }
}
