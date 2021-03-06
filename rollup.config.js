import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import banner from 'rollup-plugin-banner';
import { join } from 'path';

const bannerConfig = {
	file: join(__dirname, 'LICENSE.txt'),
};

export default [
	{
		input: 'src/index.js',
		output: {
			file: 'dist/index.js',
			format: 'cjs',
			exports: 'named',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/index.js',
		output: {
			file: 'dist/index.esm.js',
			format: 'esm',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/index.js',
		output: {
			name: 'HandlebarsKit',
			file: 'dist/browser.js',
			format: 'umd',
			exports: 'named',
			compact: true,
		},
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**',
				presets: [
					'@babel/env',
				],
			}),
			banner(bannerConfig),
		],
	},
	{
		input: 'src/index.js',
		output: {
			name: 'HandlebarsKit',
			file: 'dist/browser.min.js',
			format: 'umd',
			exports: 'named',
			compact: true,
		},
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**',
				presets: [
					'@babel/env',
				],
			}),
			terser(),
			banner(bannerConfig),
		],
	},

	{
		input: 'src/util.js',
		output: {
			file: 'util.js',
			format: 'cjs',
			exports: 'named',
		},
		plugins: [
			resolve(),
			banner(bannerConfig),
		],
	},
];
