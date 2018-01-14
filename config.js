const path = require('path');

module.exports = {
    port: 8080,
    comics: path.join(__dirname, 'images'),
    // Not recommended to changes those sizes
    sizes: {
        thumb: {height: 75},
        small: {width: 200},
        big: {width: 800}
    }
}