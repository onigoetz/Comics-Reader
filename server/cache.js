const cacheManager = require("cache-manager");
const fsStore = require("cache-manager-fs-hash");

module.exports = cacheManager.caching({
  store: fsStore,
  options: {
    ttl: 60 * 60 * 24 * 90, // 3 months lifetime (in seconds)
    path: process.env.DIR_CACHE,
    subdirs: true
  }
});
