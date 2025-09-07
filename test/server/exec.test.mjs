import test from "ava";
import fs from "node:fs";
import tmp from "tmp-promise";

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

test("Should write to file when stdoutFile is set", async (t) => {
  const file = await tmp.file();

  await exec(["echo", "one"], { stdoutFile: file.path });

  const content = await fs.readFileSync(file.path, { encoding: "utf-8" });

  file.cleanup();

  t.is(content, "one\n");
});
