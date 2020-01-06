
export default function lt () {

	/**
	 * Tests if the first argument is less than the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{lt value test}}
	 * @param  {string|integer} value1
	 * @param  {string|integer} value2
	 * @return {boolean}
	 *
	 * @signature {{#lt value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/lt}}
	 */

	return function ltHelper (a, b, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "lt" needs 2 parameters');
		}

		if (!options.fn) return a < b || '';
		if (a < b) {
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
