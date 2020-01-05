
import { sizeOf } from '../util';

export default function empty () {
	/**
	 * Tests if the provided input is empty (string, array or object)
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{empty input}}
	 * @param  {string|array|object} input
	 * @return {boolean|string} Returns an empty string on false
	 *
	 * @signature {{#empty input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/empty}}
	 * @example
	 * // items = ['a']
	 * {{#empty items}}is empty{{else}}is not empty{{/empty}}
	 * // Result: 'is not empty'
	 */
	return function emptyHelper (...args) {
		const options = args.pop();
		const [ input ] = args;

		var result = !sizeOf(input);

		if (!options.fn) {
			return result || '';
		}
		return result ? options.fn(this) : options.inverse(this);

	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{empty a }}',
			input: { a: 1 },
			output: '',
		},
		{
			template: '{{empty a }}',
			input: { a: '' },
			output: 'true',
		},
		{
			template: '{{empty a }}',
			input: { a: [] },
			output: 'true',
		},
		{
			template: '{{empty a }}',
			input: { a: {} },
			output: 'true',
		},
		{
			template: '{{empty a }}',
			input: { a: [ 0 ] },
			output: '',
		},
		{
			template: '{{empty a }}',
			input: { a: [ 1 ] },
			output: '',
		},
		{
			template: '{{empty a }}',
			input: { a: { a: 0 } },
			output: '',
		},
		{
			template: '{{empty a }}',
			input: { a: { a: 1 } },
			output: '',
		},

		{
			template: '{{#empty a }}yes{{else}}no{{/empty}}',
			input: { a: 1 },
			output: 'no',
		},
		{
			template: '{{#empty a }}yes{{else}}no{{/empty}}',
			input: { a: '' },
			output: 'yes',
		},
	);
}
