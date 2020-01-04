
import { flatten } from '../util';

export default function add () {

	/**
	 * Add all values provided and return the result
	 * @category math
	 * @name add
	 *
	 * @signate {{add value1 value2 ... valueN}}
	 * @param {...[Array<number>|number]} values Numbers or arrays of numbers to be added together
	 * @return {number}
	 */
	return function addHelper (...args) {
		args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "add" needs at least 1 argument');
		}

		return flatten(args).reduce((a, b) => a + b, 0);
	};
	/***/
}

export function test (t) {
	t.simple({
		template: '{{add a b c d}}',
		input: { a: [ 1, 2, 3 ], b: 4, c: 5, d: 6 },
		output: '21',
	});

	t.simple({
		template: '{{add a b}}',
		input: { a: [ 1, 2, 3 ], b: 0 },
		output: '6',
	});

	t.simple({
		template: '{{add a}}',
		input: { a: [ 1, 2, 3 ] },
		output: '6',
	});
}