import cacheManager from "cache-manager";
import fsStore from "cache-manager-fs-hash";

export default cacheManager.caching({
  store: fsStore,
  options: {
    ttl: 60 * 60 * 24 * 90, // 3 months lifetime (in seconds)
    path: process.env.DIR_CACHE,
    subdirs: true
  }
});
