const childProcess = require("child_process");

const shellEscape = require("shell-escape");

function exec(cmd, opts) {
  const options = opts || {};
  return new Promise((resolve, reject) => {
    childProcess.exec(
      cmd,
      options,
      (err, stdout, stderr) =>
        err
          ? reject(err)
          : resolve({
            stdout: stdout.toString("utf8"),
            stderr: stderr.toString("utf8")
          })
    );
  });
}

function escape(input) {
  return shellEscape([input]);
}

module.exports = {
  exec,
  escape
};
