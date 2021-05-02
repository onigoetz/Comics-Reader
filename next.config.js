const path = require("path");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

require("./server/env");

const serverPath = path.join(process.cwd(), "server");

const nextConfiguration = {
  future: {
    webpack5: true
  },
  env: {},
  webpack(config, options) {
    if (!config.externals) {
      config.externals = [];
    }

    config.externals.push(async ({ context, request, getResolve }) => {
      const resolve = getResolve();

      try {
        const resolved = await resolve(context, request);

        // Modules that are in the server directory should not be loaded
        // more than once and thus shouldn't be optimized
        if (resolved && resolved.indexOf(serverPath) === 0) {
          return `commonjs ${resolved}`;
        }
      } catch (e) {
        // Nothing to do here, it's quite common to not always resolve
      }

      return undefined;
    });

    return config;
  }
};

const plugins = [withBundleAnalyzer];

module.exports = withPlugins([...plugins], nextConfiguration);
