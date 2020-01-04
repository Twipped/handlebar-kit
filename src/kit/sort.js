
import { map, sizeOf, sort as sortUtil } from '../util';

export default function sort (Handlebars) {
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
	return function sortHelper (...args) {
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
	// t.simple({
	// });
}
