
import { values as valuesUtil, map, sizeOf } from '../util';

export default function valuesHelper (Handlebars) {
	/**
	 * Returns the values of an array or object.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{values input}}
	 * @param  {array<mixed>|object} input
	 * @return {array<mixed>}
	 *
	 * @signature {{#values}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/values}}
	 */
	return function values (...args) {
		const options = args.pop();
		const [ input ] = args;

		if (!options.fn) {
			return valuesUtil(input);
		}

		if (sizeOf(input)) {
			var data = Handlebars.createFrame(options.data);
			return map(input, (v, k, i) => {
				data.index = i;
				data.key = k;
				data.first = (i === 0);
				data.last  = (i === input.length - 1);
				return options.fn(v, { data });
			}).join('');
		}
		return options.inverse(this);
	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{values a}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: 'a,b,c',
		},
		{
			template: '{{values a}}',
			input: { a: { a: 1, b: 2, c: 3 } },
			output: '1,2,3',
		},
		{
			template: '{{values a}}',
			input: { a: [] },
			output: '',
		},
		{
			template: '{{#values a}}<{{this}}>{{else}}no{{/values}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: '<a><b><c>',
		},
		{
			template: '{{#values a}}<{{this}}>{{else}}no{{/values}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
