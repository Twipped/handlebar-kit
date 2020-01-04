
import { map } from '../util';

export default function after (Handlebars) {
	/**
	 * Returns all of the items in the collection after the specified index.
	 * May be used inline or as an iterator.
	 *
	 * @category collections
	 * @signature {{after items [count]}}
	 * @param  {Array}  input Collection
	 * @param  {Number} [count] Number of items to exclude
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#after input [count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/after}}
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#after items 2}}<span>{{this}}</span>{{/after}}
	 * // Result: <span>c</span><span>d</span><span>e</span><span>f</span>
	 */
	return function afterHelper (...args) {
		if (args.length === 1) {
			throw new Error('Handlebars Helper "after" needs at least one parameter');
		}

		const options = args.pop();
		const [ input, count ] = args;

		var results = input.slice(count);
		if (!options.fn) {
			return results;
		}
		if (results.length) {
			var data = Handlebars.createFrame(options.data);
			return map(results, (result, key, i) => {
				data.index = i;
				data.key = key;
				data.first = (i === 0);
				data.last  = (i === results.length - 1);
				return options.fn(result, { data });
			}).join('');
		}
		return options.inverse(this);
	};
	/***/
}

export function test (t) {
	t.simple({
		template: '{{after a }}',
		input: { a: [ 1, 2, 3, 4, 5 ] },
		output: '1,2,3,4,5',
	});
	t.simple({
		template: '{{after a 2}}',
		input: { a: [ 1, 2, 3, 4, 5 ] },
		output: '3,4,5',
	});
	t.simple({
		template: '{{after a 6}}',
		input: { a: [ 1, 2, 3, 4, 5 ] },
		output: '',
	});
	t.simple({
		template: '{{#after a }}|{{this}}|{{/after}}',
		input: { a: [ 1, 2, 3, 4, 5 ] },
		output: '|1||2||3||4||5|',
	});
	t.simple({
		template: '{{#after a 2}}|{{this}}|{{/after}}',
		input: { a: [ 1, 2, 3, 4, 5 ] },
		output: '|3||4||5|',
	});
	t.simple({
		template: '{{#after a 6}}|{{this}}|{{/after}}',
		input: { a: [ 1, 2, 3, 4, 5 ] },
		output: '',
	});
}
