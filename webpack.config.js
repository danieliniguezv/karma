const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: './frontend/src/index.js',
	plugins: [
		new Dotenv({
			path: path.resolve(__dirname, './frontend', '.env'),
		}),
	],
	output: {
		path: path.resolve(__dirname, './frontend/src'),
		filename: 'main.js',
	},
};
