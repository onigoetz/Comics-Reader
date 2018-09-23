const path = require('path');

module.exports = {
    jwtSecret: process.env.JWT_SECRET || "MyS3cr3tK3Y",
    port: 8080,
    comics: path.join(__dirname, 'images'),
    // Not recommended to changes those sizes
    sizes: {
        thumb: {height: 140},
        small: {width: 200},
        big: {width: 800}
    }
}