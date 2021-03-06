
import { isArray, isString, isObject, map } from '../util';

export default function lastHelper (Handlebars) {
	/**
	 * Returns the last N items in the passed array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections,strings
	 * @signature {{last input[ count]}}
	 * @param  {Array|Object|String}  input Collection or String
	 * @param  {Number} [count] Number of items to exclude
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#last input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/last}}
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#last items, 2}}<span>{{this}}</span>{{/last}}
	 * // Result: <span>a</span><span>b</span>
	 */
	return function last (...args) {
		const options = args.pop();
		if (!args.length) {
			throw new Error('Handlebars Helper "first" needs at least one parameter');
		}

		let [ input, count ] = args;
		count = count || 1;

		// not a block function, so we just need to return the requested parts
		if (!options.fn) {
			if (isObject(input)) {
				input = Object.values(input);
			}
			if (isArray(input) || isString(input)) return count > 1 ? input.slice(-count) : input[input.length - 1];
			return;
		}

		// received a string
		if (isString(input)) {
			if (!input.length) return options.inverse(this);
			return options.fn(input.slice(-count));
		}

		var data = Handlebars.createFrame(options.data);

		// received an object collection
		if (input && typeof input === 'object' && !Array.isArray(input)) {
			var keys = Object.keys(input);
			if (!keys.length) {
				return options.inverse(this);
			}

			return keys.slice(-count).map((key, i) => {
				var result = input[key];
				data.index = i;
				data.key = key;
				data.first = (i === 0);
				data.last  = (i === keys.length - 1);
				return options.fn(result, { data });
			}).join('');
		}

		var results = count ? input.slice(-count) : [ input[0] ];
		if (!results.length) {
			return options.inverse(this);
		}

		return map(results, (result, key, i) => {
			data.index = i;
			data.key = key;
			data.first = (i === 0);
			data.last  = (i === results.length - 1);
			return options.fn(result, { data });
		}).join('');

	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{last a }}',
			input: { a: [ 1, 2, 3 ] },
			output: '3',
		},
		{
			template: '{{last a 2}}',
			input: { a: [ 3, 2, 1 ] },
			output: '2,1',
		},
		{
			template: '{{#last a 2}}|{{this}}|{{else}}no{{/last}}',
			input: { a: [ 3, 2, 1 ] },
			output: '|2||1|',
		},
		{
			template: '{{#last a 2}}|{{this}}|{{else}}no{{/last}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
