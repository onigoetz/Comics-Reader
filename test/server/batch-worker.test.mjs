import test from "ava";

import BatchWorker from "../../server/batch-worker.js";

test("should batch task together as long as the file hasn't been opened", async (t) => {
  let openCount = 0;

  class BatchInstance {
    read(path) {
      return new Promise((resolve) => {
        setTimeout(() => {
          openCount++;
          resolve({});
        }, 100);
      });
    }

    async run(openedFile, actions) {
      for (const action of actions) {
        try {
          action.deferred.resolve(await action.action());
        } catch (e) {
          action.deferred.reject(e);
        }
      }
    }
  }

  const bw = new BatchWorker();

  const promises = [];

  promises.push(
    bw.addTask("dummy.zip", BatchInstance, {
      subPath: "file1.jpg",
      action: () => {
        return "read file1.jpg"
      },
    })
  );

  promises.push(
    bw.addTask("dummy.zip", BatchInstance, {
      subPath: "file2.jpg",
      action: () => {
        return "read file2.jpg"
      },
    })
  );

  const results = await Promise.all(promises);

  t.is(1, openCount);
  t.deepEqual(results, ["read file1.jpg", "read file2.jpg"]);
});

test("should run separate tasks for separate files", async t => {
    let openCount = 0;

    class BatchInstance {
      read(path) {
        return new Promise((resolve) => {
          setTimeout(() => {
            openCount++;
            resolve({});
          }, 100);
        });
      }
  
      async run(openedFile, actions) {
        for (const action of actions) {
          try {
            action.deferred.resolve(await action.action());
          } catch (e) {
            action.deferred.reject(e);
          }
        }
      }
    }
  
    const bw = new BatchWorker();
  
    const promises = [];
  
    promises.push(
      bw.addTask("dummy.zip", BatchInstance, {
        subPath: "file1.jpg",
        action: () => {
          return "read file1.jpg"
        },
      })
    );
  
    promises.push(
      bw.addTask("dummy2.zip", BatchInstance, {
        subPath: "file2.jpg",
        action: () => {
          return "read file2.jpg"
        },
      })
    );
  
    const results = await Promise.all(promises);
  
    t.is(2, openCount);
    t.deepEqual(results, ["read file1.jpg", "read file2.jpg"]);
});


test("should reject all promises if an opener failed", async t => {
    class BatchInstance {
      read(path) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Something bad happened"))
          }, 100);
        });
      }
  
      async run(openedFile, actions) {
        for (const action of actions) {
          try {
            action.deferred.resolve(await action.action());
          } catch (e) {
            action.deferred.reject(e);
          }
        }
      }
    }
  
    const bw = new BatchWorker();
  
    const promises = [];
  
    promises.push(
      bw.addTask("dummy.zip", BatchInstance, {
        subPath: "file1.jpg",
        action: () => {
          return "read file1.jpg"
        },
      })
    );
  
    promises.push(
      bw.addTask("dummy2.zip", BatchInstance, {
        subPath: "file2.jpg",
        action: () => {
          return "read file2.jpg"
        },
      })
    );
  
    const results = await Promise.allSettled(promises);
  
    t.deepEqual(results.map(result => result.status), ["rejected", "rejected"]);
});

test("should still run other actions if one action failed", async t => {
    let openCount = 0;

    class BatchInstance {
      read(path) {
        return new Promise((resolve) => {
          setTimeout(() => {
            openCount++;
            resolve({});
          }, 100);
        });
      }
  
      async run(openedFile, actions) {
        for (const action of actions) {
          try {
            action.deferred.resolve(await action.action());
          } catch (e) {
            action.deferred.reject(e);
          }
        }
      }
    }
  
    const bw = new BatchWorker();
  
    const promises = [];
  
    promises.push(
      bw.addTask("dummy.zip", BatchInstance, {
        subPath: "file1.jpg",
        action: () => {
          throw new Error("I had a bad feeling about this");
        },
      })
    );
  
    promises.push(
      bw.addTask("dummy.zip", BatchInstance, {
        subPath: "file2.jpg",
        action: () => {
          return "read file2.jpg"
        },
      })
    );
  
    const results = await Promise.allSettled(promises);
  
    t.is(1, openCount);
    t.deepEqual(results.map(result => result.status), ["rejected", "fulfilled"]);
});