
import { map, sizeOf, isUndefined } from '../util';

export default function joinHelper (Handlebars) {
	/**
	 * Joins all elements of a collection into a string using a separator if specified.
	 * If used as an iterator block, the block contents will be used as a replacement for the item in the array, and then output after joined.
	 * Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{join items[ separator]}}
	 * @param  {array<mixed>} input
	 * @param  {string} [separator] Defaults to `','`
	 * @return {string}
	 *
	 * @signature {{#join items[ separator]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/join}}
	 */
	return function join (...args) {
		if (args.length === 1) {
			throw new Error('Handlebars Helper "join" needs at least one parameter');
		}

		const options = args.pop();
		const input = args[0];
		const delimiter = isUndefined(args[1]) ? ', ' : args[1];

		if (!sizeOf(input)) {
			return options.inverse ? options.inverse(this) : '';
		}

		if (options.fn) {
			var data = Handlebars.createFrame(options.data);
			return map(input, (result, key, i) => {
				data.index = i;
				data.key = key;
				data.first = (i === 0);
				data.last  = (i === input.length - 1);
				return options.fn(result, { data });
			}).join(delimiter);
		}

		return input.join(delimiter);
	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{join a}}',
			input: { a: [ 1, 2, 3 ] },
			output: '1, 2, 3',
		},
		{
			template: '{{join a "-"}}',
			input: { a: [ 1, 2, 3 ] },
			output: '1-2-3',
		},
		{
			template: '{{join a ""}}',
			input: { a: [ 1, 2, 3 ] },
			output: '123',
		},
		{
			template: '{{#join a "|"}}<{{this}}>{{else}}no{{/join}}',
			input: { a: [ 1, 2, 3 ] },
			output: '<1>|<2>|<3>',
		},
		{
			template: '{{#join a "|"}}<{{this}}>{{else}}no{{/join}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
