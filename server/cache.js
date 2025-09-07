import { createCache } from "cache-manager";
import fsStore from "cache-manager-fs-hash";

const cachePreparation = createCache(
  fsStore.create({
    ttl: 60 * 60 * 24 * 90, // 3 months lifetime (in seconds)
    path: process.env.DIR_CACHE,
    subdirs: true
  })
);

export default {
  async wrap(key, fn, options) {
    const cache = await cachePreparation;

    return cache.wrap(key, fn, options);
  }
};
