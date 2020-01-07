
import { keys as keysUtil, map, sizeOf } from '../util';

export default function keysHelper (Handlebars) {
	/**
	 * Returns the indexes of an array or the keys of an object.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{keys input}}
	 * @param  {array<mixed>|object} input
	 * @return {array<integer|string>}
	 *
	 * @signature {{#keys}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/keys}}
	 */
	return function keys (...args) {

		const options = args.pop();
		const [ input ] = args;

		if (!options.fn) {
			return keysUtil(input);
		}

		if (sizeOf(input)) {
			var data = Handlebars.createFrame(options.data);
			return map(input, (v, k, i) => {
				data.index = i;
				data.key = k;
				data.first = (i === 0);
				data.last  = (i === input.length - 1);
				return options.fn(k, { data });
			}).join('');
		}
		return options.inverse(this);
	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{keys a}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: '0,1,2',
		},
		{
			template: '{{keys a}}',
			input: { a: { a: 1, b: 2, c: 3 } },
			output: 'a,b,c',
		},
		{
			template: '{{keys a}}',
			input: { a: [] },
			output: '',
		},
		{
			template: '{{#keys a}}<{{this}}>{{else}}no{{/keys}}',
			input: { a: [ 'a', 'b', 'c' ] },
			output: '<0><1><2>',
		},
		{
			template: '{{#keys a}}<{{this}}>{{else}}no{{/keys}}',
			input: { a: [] },
			output: 'no',
		},
	);
}
