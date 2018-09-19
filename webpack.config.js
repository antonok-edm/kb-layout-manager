const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: 'development',
	entry: {
		main: './client/client.js',
	},
	output: {
		filename: 'client.js',
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|dist|app.js)/,
				use: ['babel-loader', 'eslint-loader'],
			},
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader'],
			},
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "client/index.html",
			filename: "index.html",
		}),
	],
};
