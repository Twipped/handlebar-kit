
import { map, isString } from '../util';

export default function split (Handlebars) {
	/**
	 * Splits a string into an array.
	 * May be used inline or as an iterator. Else condition will never evaluate.
	 *
	 * @category strings
	 * @signature {{split input[ delimiter]}}
	 * @param  {string} input
	 * @param  {string} [delimiter] Defaults to ',' if not provided.
	 * @return {array<string>}
	 *
	 * @signature {{#split input[ delimiter]}}<TEMPLATE>{{/split}}
	 */
	return function splitHelper (...args) {

		const options = args.pop();
		const [ input, delimiter ] = args;

		if (!args.length) {
			throw new Error('Handlebars Helper "split" needs at least 1 parameter');
		}

		if (!isString(input)) {
			console.trace('Handlebars Helper "split" did not receive a string'); // eslint-disable-line no-console
			return '';
		}

		var results = input.split(delimiter);

		if (!options.fn) {
			return results;
		}
		var data = Handlebars.createFrame(options.data);
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
