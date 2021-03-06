
export default function gteHelper () {

	/**
	 * Tests if the first argument is greater than or equal to the second argument.
	 * May be used inline or as a conditional block.
	 * @category logic
	 *
	 * @signature {{gte value1 value2}}
	 * @param  {string|integer} value1
	 * @param  {string|integer} value2
	 * @return {boolean}
	 *
	 * @signature {{#gte value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/gte}}
	 */

	return function gte (a, b, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "gte" needs 2 parameters');
		}

		if (!options.fn) return a >= b || '';
		if (a >= b) {
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
