const cacheManager = require("cache-manager");
const fsStore = require("cache-manager-fs-hash");

const cachePreparation = cacheManager.caching(
  fsStore.create({
    ttl: 60 * 60 * 24 * 90, // 3 months lifetime (in seconds)
    path: process.env.DIR_CACHE,
    subdirs: true
  })
);

module.exports = {
  async wrap(key, fn, options) {
    const cache = await cachePreparation;

    return cache.wrap(key, fn, options);
  }
};
