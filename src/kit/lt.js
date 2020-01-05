
export default function lt () {

	/**
	 * Tests if the first argument is less than the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{lt value test}}
	 * @param  {string|integer} value Smaller value
	 * @param  {string|integer} test  Greater value
	 * @return {boolean}
	 *
	 * @signature {{#lt value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/lt}}
	 */

	return function ltHelper (value, test, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "lt" needs 2 parameters');
		}

		if (!options.fn) return value < test || '';
		if (value < test) {
			return options.fn(this);
		}
		return options.inverse(this);

	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{lt a b}}',
			input: { a: 1, b: 2 },
			output: 'true',
		},
		{
			template: '{{lt a b}}',
			input: { a: 2, b: 1 },
			output: '',
		},
		{
			template: '{{lt a b}}',
			input: { a: 2, b: 2 },
			output: '',
		},
		{
			template: '{{#lt a b}}yes{{else}}no{{/lt}}',
			input: { a: 1, b: 2 },
			output: 'yes',
		},
		{
			template: '{{#lt a b}}yes{{else}}no{{/lt}}',
			input: { a: 2, b: 1 },
			output: 'no',
		},
		{
			template: '{{#lt a b}}yes{{else}}no{{/lt}}',
			input: { a: 2, b: 2 },
			output: 'no',
		},
	);
}
