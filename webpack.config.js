const HtmlWebPackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const ESLintPlugin = require('eslint-webpack-plugin');
const { NormalModuleReplacementPlugin } = require('webpack');

const demo_mode = ("KB_LAYOUT_MANAGER_DEMO_MODE" in process.env);

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
                test: [/\.ico$/, /\.c$/, /\.svg$/],
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
        new NormalModuleReplacementPlugin(
            /^\.\/utils\/server_connection.js$/,
            function (resource) {
                if (demo_mode) {
                    console.log('[KB_LAYOUT_MANAGER_DEMO_MODE] using mock_server_connection.js');
                    resource.request = './utils/mock_server_connection.js';
                }
            },
        ),
    ],
};
