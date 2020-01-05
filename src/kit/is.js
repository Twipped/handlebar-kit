
export default function is () {

	/**
	 * Tests if the first argument matches any of the other arguments with strict equality.
	 * @category comparisons
	 *
	 * @signature {{is value test1 ... testN}}
	 * @param  {mixed} value Value to check against
	 * @param  {mixed} ...test Values to test
	 * @return {mixed} Matched value
	 *
	 * @signature {{#is value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/is}}
	 * @describe Truthy block will evaluate with the result value as the current context ({this}).
	 */

	return function isHelper (...args) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "is" needs a minimum of 2 arguments');
		}

		const options = args.pop();
		const value = args.shift();

		var result = args.includes(value);

		if (!options.fn) return result || '';

		return result ? options.fn(result) : options.inverse(this);
	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{is a b}}',
			input: { a: 1, b: 2 },
			output: '',
		},
		{
			template: '{{is a b}}',
			input: { a: 2, b: 1 },
			output: '',
		},
		{
			template: '{{is a b}}',
			input: { a: 2, b: 2 },
			output: 'true',
		},
		{
			template: '{{is a b}}',
			input: { a: '2', b: 2 },
			output: '',
		},
		{
			template: '{{#is a b}}yes{{else}}no{{/is}}',
			input: { a: 1, b: 2 },
			output: 'no',
		},
		{
			template: '{{#is a b}}yes{{else}}no{{/is}}',
			input: { a: 2, b: 1 },
			output: 'no',
		},
		{
			template: '{{#is a b}}yes{{else}}no{{/is}}',
			input: { a: 2, b: 2 },
			output: 'yes',
		},
		{
			template: '{{#is a b}}yes{{else}}no{{/is}}',
			input: { a: 2, b: '2' },
			output: 'no',
		},
		{
			template: '{{#is 1 2 3}}yes{{else}}no{{/is}}',
			input: {},
			output: 'no',
		},
		{
			template: '{{#is 2 2 3}}yes{{else}}no{{/is}}',
			input: {},
			output: 'yes',
		},
	);
}
