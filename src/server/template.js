const fs = require("fs");

const Hogan = require("hogan.js");

const template = Hogan.compile(
  fs.readFileSync(`${__dirname}/../index.html`, { encoding: "utf8" })
);

module.exports = function generateLayout(BASE) {
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
          template.render({
            BASE,
            CSS: style.replace(
              "/*# sourceMappingURL=app.min.css.map */",
              `/*# sourceMappingURL=${BASE}static/css/app.min.css.map */`
            ),
            JS: `${BASE}static/js/${
              require("../../static/asset-manifest.json")["default.js"]
            }`
          })
        );
      }
    );
  });
};
