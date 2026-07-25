import test from "ava";

import { exec } from "../../server/exec.js";

test("Should return the right result for the right execution", async (t) => {
  const promises = [];
  promises.push(exec(["echo", "one"]));
  promises.push(exec(["echo", "two"]));
  promises.push(exec(["echo", "three"]));
  promises.push(exec(["echo", "four"]));
  promises.push(exec(["echo", "five"]));
  promises.push(exec(["echo", "six"]));
  promises.push(exec(["echo", "seven"]));
  promises.push(exec(["echo", "eight"]));
  promises.push(exec(["echo", "nine"]));
  promises.push(exec(["echo", "ten"]));
  promises.push(exec(["echo", "eleven"]));
  promises.push(exec(["echo", "twelve"]));

  const results = await Promise.all(promises);

  t.deepEqual(
    results.map((promise) => promise.stdout),
    [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
    ]
  );
});

test("Should properly bubble up errors while not failing other commands", async (t) => {
  const promises = [];
  promises.push(exec(["echo", "one"]));
  promises.push(exec(["echo", "two"]));
  promises.push(exec(["definitelynotacommand"]));
  promises.push(exec(["echo", "four"]));
  promises.push(exec(["echo", "five"]));
  promises.push(exec(["echo", "six"]));

  const results = await Promise.allSettled(promises);

  t.deepEqual(
    results.map((promise) =>
      promise.status === "fulfilled"
        ? promise.value.stdout
        : promise.reason.message
    ),
    [
      "one",
      "two",
      "Command failed with ENOENT: definitelynotacommand\nspawn definitelynotacommand ENOENT",
      "four",
      "five",
      "six",
    ]
  );
});
