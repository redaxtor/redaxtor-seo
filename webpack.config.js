'use strict';

var path = require('path')
var webpack = require('webpack')
var env = process.env.NODE_ENV
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
    output: {
        path: path.join(__dirname, 'dist/'),
        // filename: '[name].js',
        library: 'RedaxtorSeo',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        })
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [
                        'babel-plugin-transform-object-rest-spread',
                        'babel-plugin-transform-class-properties'//used in material-ui
                    ]
                }
            },
            {
                test: /\.less$/,
                loader: "style!css?-url!less"//don't use loaders for urls
            }
        ],
        noParse: []
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            react: path.resolve(node_modules_dir, 'react')
        }
    },
    devtool: "source-map"
    // devtool: "eval-cheap-source-map"
}

if (env === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                warnings: false
            }
        })
    )
}

module.exports = config