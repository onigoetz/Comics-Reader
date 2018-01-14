const fs = require("fs");

const Hogan = require("hogan.js");

const template = Hogan.compile(
  fs.readFileSync(`${__dirname}/../index.html`, { encoding: "utf8" })
);

const production = process.env.NODE_ENV === "production";

function getManifest() {
  if (!production) {
    delete require.cache[require.resolve("../../static/asset-manifest.json")]
  }

  return require("../../static/asset-manifest.json");
}

function render(BASE, style) {
  return template.render({
    BASE,
    CSS: style,
    JS: `${BASE}static/js/${getManifest()["default.js"]}`
  })
}

module.exports = function generateLayout(BASE) {
  if (!production) {
    return Promise.resolve(render(BASE, `<link rel="stylesheet" href="${BASE}static/css/app.min.css"/>`));
  }

  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/../../static/css/app.min.css`,
      { encoding: "utf8" },
      (err, style) => {
        if (err) {
          reject(err);

          return;
        }

        resolve(
          render(
            BASE, "<style>" + style.replace(
              "/*# sourceMappingURL=app.min.css.map */",
              `/*# sourceMappingURL=${BASE}static/css/app.min.css.map */`
            )) + "</style>"
        );
      }
    );
  });
};
