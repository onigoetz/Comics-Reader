var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js'
    },
    plugins: [
        new ManifestPlugin({
            fileName: '../asset-manifest.json'
        })
    ],
    module: {
        rules: [
            {
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                loader: require.resolve('file-loader'),
                options: {
                  name: '../media/[name].[hash:8].[ext]',
                },
            }
        ]
    }
}