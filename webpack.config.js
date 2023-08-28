const HtmlWebPackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/client/client.js',
    },
    output: {
        filename: 'client.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
            {
                test: /\.s?(c|a)?ss$/,
                use: ['vue-style-loader', 'css-loader', {loader: 'sass-loader', options: {sassOptions: {indentedSyntax: true}}}],
            },
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
            {
                test: /\.ico$/,
                use: {loader: 'file-loader', options: {name: '[name].[ext]'}},
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "src/client/index.html",
            filename: "index.html",
        }),
        new VueLoaderPlugin(),
        new ESLintPlugin({}),
    ],
};
