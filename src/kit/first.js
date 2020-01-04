
import { map, isArray, isString, isObject } from '../util';

export default function first (Handlebars) {
	/**
	 * Returns the first N items in the passed array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections,strings
	 * @signature {{first input[ count]}}
	 * @param  {Array|Object|String}  input Collection or String
	 * @param  {Number} [count] Number of items to exclude
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#first input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/first}}
	 * @param {Array|Object|String} [varname] [description]
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#first items, 2}}<span>{{this}}</span>{{/first}}
	 * // Result: <span>a</span><span>b</span>
	 */
	return function firstHelper (...args) {
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
			if (isArray(input) || isString(input)) return count > 1 ? input.slice(0, count) : input[0];
			return;
		}

		// received a string
		if (isString(input)) {
			if (!input.length) return options.inverse(this);
			return options.fn(input.slice(0, count));
		}

		var data = Handlebars.createFrame(options.data);

		// received an object collection
		if (isObject(input)) {
			var keys = Object.keys(input);
			if (!keys.length) {
				return options.inverse(this);
			}

			return keys.slice(0, count).map((key, i) => {
				var result = input[key];
				data.index = i;
				data.key = key;
				data.first = (i === 0);
				data.last  = (i === keys.length - 1);
				return options.fn(result, { data });
			}).join('');
		}

		var results = count ? input.slice(0, count) : [ input[0] ];
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
	// t.simple({
	// });
}
