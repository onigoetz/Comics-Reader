import path from "path";
import withPlugins from "next-compose-plugins";
import bundleAnalyzer from "@next/bundle-analyzer";

import "./server/env.mjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

const serverPath = path.join(process.cwd(), "server");

const nextConfiguration = {
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

export default withPlugins([...plugins], nextConfiguration);
