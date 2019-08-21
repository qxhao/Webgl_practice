const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const config = {
    entry: {
        bundle: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: 'dist'
    },

    devServer: {
        contentBase: __dirname,
        compress: true,
        port: process.env.NODE_PORT || 5000
    },

    resolve: {
        alias: {
        },
        extensions: [".js", "json"]
    },

    module: {
        rules: [{
            test: /\.(glsl|vs|fs)$/,
            use: "shader-loader"
        }]
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            chunks: ['bundle'],
            filename: 'index.html'
        })
    ],
};

config['devtool'] = 'source-map'

module.exports = config;

