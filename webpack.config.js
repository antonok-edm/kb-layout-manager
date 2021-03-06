const HtmlWebPackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

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
                test: /\.js$/,
                //exclude: /(node_modules|dist|app.js)/,
                use: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.s?(c|a)?ss$/,
                loaders: ['vue-style-loader', 'style-loader', 'css-loader', {loader: 'sass-loader', options: {indentedSyntax: true}}],
            },
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]',
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "src/client/index.html",
            filename: "index.html",
        }),
        new VueLoaderPlugin(),
    ],
};
