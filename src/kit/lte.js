
export default function lte () {

	/**
	 * Tests if the first argument is less than or equal to the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{lte value test}}
	 * @param  {string|integer} value1
	 * @param  {string|integer} value2
	 * @return {boolean}
	 *
	 * @signature {{#lte value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/lte}}
	 */

	return function lteHelper (a, b, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "lte" needs 2 parameters');
		}

		if (!options.fn) return a <= b || '';
		if (a <= b) {
			return options.fn(this);
		}
		return options.inverse(this);

	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{lte a b}}',
			input: { a: 1, b: 2 },
			output: 'true',
		},
		{
			template: '{{lte a b}}',
			input: { a: 2, b: 1 },
			output: '',
		},
		{
			template: '{{lte a b}}',
			input: { a: 2, b: 2 },
			output: 'true',
		},
		{
			template: '{{#lte a b}}yes{{else}}no{{/lte}}',
			input: { a: 1, b: 2 },
			output: 'yes',
		},
		{
			template: '{{#lte a b}}yes{{else}}no{{/lte}}',
			input: { a: 2, b: 1 },
			output: 'no',
		},
		{
			template: '{{#lte a b}}yes{{else}}no{{/lte}}',
			input: { a: 2, b: 2 },
			output: 'yes',
		},
	);
}
