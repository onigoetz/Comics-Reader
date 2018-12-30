const ManifestPlugin = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

module.exports = {
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js'
    },
    plugins: [
        new ManifestPlugin({
            fileName: '../asset-manifest.json'
        }),
        new webpack.NormalModuleReplacementPlugin(
            /.*\/node_modules\/history\/createBrowserHistory\.js/,
            require.resolve('history/es/createBrowserHistory.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
            /.*\/node_modules\/history\/createHashHistory\.js/,
            require.resolve('history/es/createHashHistory.js')
        ),
        //new BundleAnalyzerPlugin({analyzerMode: "static"}) 
    ],
    module: {
        rules: [
            {
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.css$/],
                loader: require.resolve('file-loader'),
                options: {
                  name: '../media/[name].[hash:8].[ext]',
                },
            }
        ]
    }
}