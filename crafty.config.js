module.exports = {
    browsers: [">0.3%", "not ie 11", "not dead", "not op_mini all", "Safari >= 11", "iOS >= 11", "Chrome >= 70", "Firefox >= 60", "Edge >= 17"].join(", "),
    presets: [
        "@swissquote/crafty-preset-eslint",
        "@swissquote/crafty-preset-postcss"
    ]
};
