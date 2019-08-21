module.exports = {
  browsers: "Safari >= 9, iOS >= 9, Chrome >= 33, Firefox >= 29, Edge >= 13",
  img_basedir: "src/images",
  presets: [
    "@swissquote/crafty-preset-images-simple",
    "@swissquote/crafty-preset-eslint",
    "@swissquote/crafty-preset-postcss",
    "@swissquote/crafty-runner-gulp"
  ],
  css: {
    app: {
      source: "src/css/app.scss",
      watch: ["src/css/**"]
    }
  }
};
