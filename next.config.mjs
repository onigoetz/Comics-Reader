import path from "node:path";
import withPlugins from "next-compose-plugins";
import wBA from "@next/bundle-analyzer";

const withBundleAnalyzer = wBA({
  enabled: process.env.ANALYZE === "true"
});

import "./server/env.js";

const serverPath = path.join(process.cwd(), "server");

const nextConfiguration = {
  // can't use standalone output as we have a custom server
  //output: "standalone",
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
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // Nothing to do here, it's quite common to not always resolve
      }

      return undefined;
    });

    return config;
  }
};

const plugins = [withBundleAnalyzer];

export default withPlugins([...plugins], nextConfiguration);
