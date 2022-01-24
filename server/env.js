const path = require("path");

/**
 * "db" or "basic"
 *
 * "db" is handled with the embedded sqlite db,
 * "basic" has to be handled by an external provider like Apache or Nginx,
 *         this app will only read the headers to populate the "read" table.
 *         If no basic auth user is specified it will use "anonymous"
 */
process.env.AUTH_MODE = process.env.COMICS_AUTH_TYPE || "basic";

/**
 * The JWT secret key for authentication, use anything
 * other than the default as it won't be secure at all.
 */
process.env.JWT_SECRET = process.env.COMICS_JWT_SECRET || "MyS3cr3tK3Y";

/**
 * Where the images are stored
 */
process.env.DIR_COMICS = path.join(process.cwd(), "images");

/**
 * Data cache
 */
process.env.DIR_CACHE = path.join(process.cwd(), "cache");

/**
 * The port this app listens on
 */
process.env.SERVER_PORT = 8080;
process.env.SERVER_URL = `http://localhost:${process.env.SERVER_PORT}/`;

/**
 * The Schedule at which to refresh the library
 * You can continue reading while the refresh is in progress
 *
 * You can easily create cron schedules at here : https://crontab.guru/#25_3_*_*_*
 */
process.env.REFRESH_SCHEDULE = "25 3 * * *";
