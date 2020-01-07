
import { map, sizeOf, sort as sortUtil } from '../util';

export default function sortHelper (Handlebars) {
	/**
	 * Sorts the provided array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{sort input[ key]}}
	 * @param  {array<mixed>} input
	 * @param  {string} [key] If the input is a collection of objects, pass this argument to indicate what key should be compared.
	 * @return {array}
	 *
	 * @signature {{#sort input[ key]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/sort}}
	 */
	return function sort (...args) {
		const options = args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "sort" needs at least 1 parameter');
		}

		const [ input, key ] = args;

		const results = sortUtil(input, key);

		if (!options.fn) {
			return results;
		}

		if (sizeOf(results)) {
			var data = Handlebars.createFrame(options.data);
			return map(results, (result, k, i) => {
				data.index = i;
				data.key = k;
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
			template: '{{sort a }}',
			input: { a: [ 1, 2, 3 ] },
			output: '1,2,3',
		},
		{
			template: '{{sort a}}',
			input: { a: [ 3, 2, 1 ] },
			output: '1,2,3',
		},
		{
			template: '{{sort a}}',
			input: { a: [] },
			output: '',
		},
		{
			template: '{{#sort a "a"}}|{{#each this}}{{@key}}:{{this}},{{/each}}|{{else}}no{{/sort}}',
			input: { a: [ { a: 4 }, { a: 3 }, { b: 1 } ] },
			output: '|a:3,||a:4,||b:1,|',
		},
		{
			template: '{{#sort a}}|{{this}}|{{else}}no{{/sort}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
