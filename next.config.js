const path = require("path");

const withPlugins = require("next-compose-plugins");
const resolve = require("resolve");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

require("./server/env");

const serverPath = path.join(process.cwd(), "server");

const nextConfiguration = {
  future: {
    webpack5: true,
  },
  env: {},
  webpack(config, options) {
    if (!config.externals) {
      config.externals = [];
    }

    config.externals.push(function({context, request}, callback) {
      resolve(
        request,
        { basedir: context, preserveSymlinks: true },
        (err, res) => {
          if (err) {
            return callback();
          }

          if (!res) {
            return callback();
          }

          // Modules that are in the server directory should not be loaded
          // more than once and thus shouldn't be optimized
          if (res.indexOf(serverPath) === 0) {
            return callback(null, `commonjs ${res}`);
          }

          callback();
        }
      );
    });

    return config;
  }
};

const plugins = [withBundleAnalyzer];

module.exports = withPlugins([...plugins], nextConfiguration);
