const path = require('path');

module.exports = {
    /**
     * "db" or "basic"
     * 
     * "db" is handled with the embedded sqlite db, 
     * "basic" has to be handled by an external provider like Apache or Nginx, 
     *         this app will only read the headers to populate the "read" table.
     *         If no basic auth user is specified it will use "anonymous"
     */
    auth: process.env.COMICS_AUTH_TYPE || "basic",

    /**
     * The JWT secret key for authentication, use anything
     * other than the default as it won't be secure at all.
     */
    jwtSecret: process.env.COMICS_JWT_SECRET || "MyS3cr3tK3Y",

    /**
     * The port this app listens on
     */
    port: 8080,

    /**
     * Where the images are stored
     */
    comics: path.join(__dirname, 'images'),

    /**
     * Data cache
     */
    cache: path.join(__dirname, 'cache'),

    // Not recommended to changes those sizes
    sizes: {
        thumb: {height: 140},
        small: {width: 200},
        big: {width: 800}
    }
}