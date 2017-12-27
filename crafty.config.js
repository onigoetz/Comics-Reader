module.exports = {
    presets: [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-preset-postcss",
      "@swissquote/crafty-runner-webpack",
      "@swissquote/crafty-runner-gulp"
    ],
    destination: "static",
    js: {
      app: {
        runner: "webpack",
        source: "src/index.js",
        libraryTarget: "umd"
      }
    },
    css: {
      app: {
        source: "src/css/app.scss",
        watch: ["src/css/**"]
      }
    }
  };