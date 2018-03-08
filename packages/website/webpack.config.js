const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    allChunks: true,
    disable: IS_DEVELOPMENT
});

const uglify = IS_PRODUCTION ? [new UglifyJsPlugin({sourceMap: true, include: /\.js$/})] : []

module.exports = {
    entry: ["whatwg-fetch", "./src/index.tsx"],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },

    // Enable sourcemaps for debugging webpack's output
    devtool: "source-map",
    resolve: {
	    extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        extractSass
    ].concat(uglify),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: {
                    loader: 'tslint-loader',
                    options: {
                        emitErrors: false 
                    }
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                use: {
                    loader: 'json-loader'
                }
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[hash].[ext]',
                        limit: 5000,
                        mimetype: 'application/font-woff'
                    }
                }
            }, 
            {
                test: /\.(ttf|eot|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[hash].[ext]'
                    }
                }
            },
            { test: /\.scss$/, 
              exclude: /global\.scss$/,
              use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                    { 
                        loader: 'css-loader', 
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]'
                        }
                    },
                    'sass-loader'
                  ]
              })
            },
            // Making the global.scss to not have locally scoped classes
            { test: /global\.scss$/,
              use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                    'css-loader',
                    'sass-loader'
                  ]
              })
            }
        ]
    }
};
