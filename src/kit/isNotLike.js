
export default function isNotLikeHelper () {

	/**
	 * Tests that the first argument does not match any of the other arguments with loose equality.
	 * @category logic
	 *
	 * @signature {{isNotLike value test1 ... testN}}
	 * @param  {mixed} value Value to check against
	 * @param  {mixed} ...test Values to test
	 * @return {mixed} Matched value
	 *
	 * @signature {{#isNotLike value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/isNotLike}}
	 */

	return function isNotLike (...args) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "isNotLike" needs a minimum of 2 arguments');
		}

		const options = args.pop();
		const value = args.shift();

		var result = true;
		var i = args.length;
		while (i-- && result) {
			result = result && (value != args[i]); // eslint-disable-line eqeqeq
		}

		if (!options.fn) return result || '';

		return result ? options.fn(this, options) : options.inverse(this, options);
	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{isNotLike a b}}',
			input: { a: 1, b: 2 },
			output: 'true',
		},
		{
			template: '{{isNotLike a b}}',
			input: { a: 2, b: 1 },
			output: 'true',
		},
		{
			template: '{{isNotLike a b}}',
			input: { a: 2, b: 2 },
			output: '',
		},
		{
			template: '{{isNotLike a b}}',
			input: { a: '2', b: 2 },
			output: '',
		},
		{
			template: '{{isNotLike a b}}',
			input: { a: '2', b: '1' },
			output: 'true',
		},
		{
			template: '{{#isNotLike a b}}yes{{else}}no{{/isNotLike}}',
			input: { a: 1, b: 2 },
			output: 'yes',
		},
		{
			template: '{{#isNotLike a b}}yes{{else}}no{{/isNotLike}}',
			input: { a: 2, b: 1 },
			output: 'yes',
		},
		{
			template: '{{#isNotLike a b}}yes{{else}}no{{/isNotLike}}',
			input: { a: 2, b: 2 },
			output: 'no',
		},
		{
			template: '{{#isNotLike a b}}yes{{else}}no{{/isNotLike}}',
			input: { a: 2, b: '2' },
			output: 'no',
		},
		{
			template: '{{#isNotLike a b}}yes{{else}}no{{/isNotLike}}',
			input: { a: '2', b: '1' },
			output: 'yes',
		},
		{
			template: '{{#isNotLike 2 "1" "2"}}yes{{else}}no{{/isNotLike}}',
			input: {},
			output: 'no',
		},
	);
}
