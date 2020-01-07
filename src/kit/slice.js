
import { isString, sizeOf, isMappable, map, slice as sliceUtil } from '../util';

export default function sliceHelper (Handlebars) {
	/**
	 * Returns a slice of an array, object map, or string
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections,strings
	 * @signature {{slice input start[ count]}}
	 * @param  {string|Array|object|Map|Set} input
	 * @param  {integer} start  Index to slice from
	 * @param  {integer} [end]  Index to slice to (stopping before)
	 * @return {mixed}
	 *
	 * @signature {{#slice input start[ end]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/slice}}
	 * @param  {string|Array|object|Map|Set} input
	 * @param  {integer} start  Index to slice from
	 * @param  {integer} [end]  Index to slice to (stopping before)
	 * @return {string}
	 */
	return function slice (...args) {
		const options = args.pop();
		const [ input, start, end ] = args;

		if (args.length < 2) {
			throw new Error('Handlebars Helper "slice" needs at least 2 parameters');
		}

		if (!isString(input) && !isMappable(input)) {
			throw new Error('Handlebars Helper "slice" did not receive a string or collection.');
		}

		if (!options.fn) {
			return sliceUtil(input, start, end);
		}

		if (isString(input)) {
			if (input.length) {
				return options.fn(input.slice(start, end));
			}
			return options.inverse(this);
		}

		const results = sliceUtil(input, start, end);

		if (sizeOf(results)) {
			var data = Handlebars.createFrame(options.data);
			return map(results, (result, key, i) => {
				data.index = i;
				data.key = key;
				data.first = (i === 0);
				data.last  = (i === results.length - 1);
				return options.fn(result, { data });
			}).join('');
		}
		return options.inverse(this);
	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{slice a 1}}',
			input: { a: 'Praesent' },
			output: 'raesent',
		},
		{
			template: '{{slice a 1 3}}',
			input: { a: 'Praesent' },
			output: 'ra',
		},
		{
			template: '{{slice a 1}}',
			input: { a: [ 3, 2, 1 ] },
			output: '2,1',
		},
		{
			template: '{{slice a 1 2}}',
			input: { a: [ 3, 2, 1 ] },
			output: '2',
		},
		{
			template: '{{slice a 0 1}}',
			input: { a: [ 3, 2, 1 ] },
			output: '3',
		},
		{
			template: '{{slice a -1}}',
			input: { a: [ 3, 2, 1 ] },
			output: '1',
		},
		{
			template: '{{#slice a 1}}|{{this}}|{{else}}no{{/slice}}',
			input: { a: [ 3, 2, 1 ] },
			output: '|2||1|',
		},
		{
			template: '{{#slice a 1}}|{{this}}|{{else}}no{{/slice}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
