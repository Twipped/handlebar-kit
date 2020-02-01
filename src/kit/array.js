
import { flatten, map } from '../util';

export default function arrayHelper (Handlebars) {

	/**
	 * Produce an array from the passed arguments
	 * @category math
	 * @name add
	 *
	 * @signate {{array value1 value2 ... valueN}}
	 * @param {...<mixed>} values Values to compose the array from
	 * @return {Array<mixed>}
	 */
	return function array (...args) {
		const options = args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "array" needs at least 1 argument');
		}

		if (options.hash && options.hash.flatten) {
			args = flatten(args);
		}

		if (!options.fn) return args;

		return map(args, (result, key, i) => {
			const data = Handlebars.createFrame(options.data);
			data.index = i;
			data.key = key;
			data.first = (i === 0);
			data.last  = (i === args.length - 1);
			return options.fn(result, { data });
		}).join('');
	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{array a b c d}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: 5, d: 6 },
			output: '1,2,3,4,5,6',
		},
		{
			template: '{{array a b c flatten=true}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: [ 5, 6, 7 ] },
			output: '1,2,3,4,5,6,7',
		},
		{
			template: '{{#array a b c}}|{{@key}},{{@index}},{{this}}|{{else}}no{{/array}}',
			input: { a: [ 1, 2, 3 ], b: 4, c: [ 5, 6, 7 ] },
			output: '|0,0,1,2,3||1,1,4||2,2,5,6,7|',
		},
	);
}
