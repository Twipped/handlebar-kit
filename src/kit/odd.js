
export default function oddHelper () {

	/**
	 * Tests if the passed argument is an odd number
	 * @category math
	 *
	 * @signature {{odd value}}
	 * @param  {number} value Value to test
	 * @return {boolean}
	 *
	 * @signature {{#odd value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/odd}}
	 * @describe Truthy block will evaluate with the result value as the current context ({this}).
	 */

	return function odd (...args) {
		if (args.length < 2) {
			throw new Error('Handlebars Helper "odd" needs a minimum of 1 arguments');
		}

		const options = args.pop();
		const value = args.shift();

		const result = !!(value % 2);
		if (!options.fn) return result || '';
		return result ? options.fn(this) : options.inverse(this);
	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{odd a}}',
			input: { a: 11 },
			output: 'true',
		},
		{
			template: '{{odd a}}',
			input: { a: 22 },
			output: '',
		},
		{
			template: '{{#odd a}}yes{{else}}no{{/odd}}',
			input: { a: 1 },
			output: 'yes',
		},
		{
			template: '{{#odd a}}yes{{else}}no{{/odd}}',
			input: { a: 0 },
			output: 'no',
		},
	);
}
