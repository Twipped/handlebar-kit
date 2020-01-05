
export default function gte () {

	/**
	 * Tests if the first argument is greater than or equal to the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{gte value test}}
	 * @param  {string|integer} value Greater value
	 * @param  {string|integer} test  Smaller value
	 * @return {boolean}
	 *
	 * @signature {{#gte value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/gte}}
	 */

	return function gteHelper (value, test, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "gte" needs 2 parameters');
		}

		if (!options.fn) return value >= test || '';
		if (value >= test) {
			return options.fn(this);
		}
		return options.inverse(this);

	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{gte a b}}',
			input: { a: 1, b: 2 },
			output: '',
		},
		{
			template: '{{gte a b}}',
			input: { a: 2, b: 1 },
			output: 'true',
		},
		{
			template: '{{gte a b}}',
			input: { a: 2, b: 2 },
			output: 'true',
		},
		{
			template: '{{#gte a b}}yes{{else}}no{{/gte}}',
			input: { a: 1, b: 2 },
			output: 'no',
		},
		{
			template: '{{#gte a b}}yes{{else}}no{{/gte}}',
			input: { a: 2, b: 1 },
			output: 'yes',
		},
		{
			template: '{{#gte a b}}yes{{else}}no{{/gte}}',
			input: { a: 2, b: 2 },
			output: 'yes',
		},
	);
}
