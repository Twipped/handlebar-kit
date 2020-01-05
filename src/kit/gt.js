
export default function gt () {

	/**
	 * Tests if the first argument is greater than the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{gt value test}}
	 * @param  {string|integer} value Greater value
	 * @param  {string|integer} test  Smaller value
	 * @return {boolean}
	 *
	 * @signature {{#gt value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/gt}}
	 */

	return function gtHelper (value, test, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "gt" needs 2 parameters');
		}

		if (!options.fn) return value > test || '';
		if (value > test) {
			return options.fn(this);
		}
		return options.inverse(this);

	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{gt a b}}',
			input: { a: 1, b: 2 },
			output: '',
		},
		{
			template: '{{gt a b}}',
			input: { a: 2, b: 1 },
			output: 'true',
		},
		{
			template: '{{gt a b}}',
			input: { a: 2, b: 2 },
			output: '',
		},
		{
			template: '{{#gt a b}}yes{{else}}no{{/gt}}',
			input: { a: 1, b: 2 },
			output: 'no',
		},
		{
			template: '{{#gt a b}}yes{{else}}no{{/gt}}',
			input: { a: 2, b: 1 },
			output: 'yes',
		},
		{
			template: '{{#gt a b}}yes{{else}}no{{/gt}}',
			input: { a: 2, b: 2 },
			output: 'no',
		},
	);
}
