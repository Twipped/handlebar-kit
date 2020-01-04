
import { filter as filterUtil } from '../util';

export default function filter (Handlebars) {
	/**
	 * Filters a passed array, depending on the arguments provided.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{filter input}} or {{#filter input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
	 * @describe Filter all falsy items (`0`, `''`, `false`, `null`, `undefined`, etc).
	 * @param {array<mixed>} input
	 * @return {array}
	 * @example
	 * // items = [0, 1, null, 'test']
	 * {{#filter items}}<p>{{this}}</p>{{/filter}}
	 * // Result: <p>1</p><p>test</p>
	 *
	 * @signature {{filter input predicate}} or {{#filter input predicate}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
	 * @describe Filter all items matching the passed predicate. Else condition evaluates if result is empty.
	 * This format matches the predicate rules of the lodash filter function.
	 * @param {array<mixed>} input
	 * @param {mixed} value Value to filter.
	 * @return {array}
	 * @example
	 * // items = [0, 1, 2]
	 * {{#filter items 1}}<p>{{this}}</p>{{/filter}}
	 * // Result: <p>0</p><p>2</p>
	 *
	 * @signature {{filter input key value}} or {{#filter input key value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
	 * @describe Performs a pluck operation, filtering all objects from the array where the provided property name does not match the provided value. (`O[n][property] != value`)
	 * @param {array<mixed>} input
	 * @param {string} key Object property name to check against the value
	 * @param {mixed} value Value to filter.
	 * @return {array}
	 * @example
	 * // original = [{a:1}, {b:2}, {a:1,b:2}, {}]
	 * {{#filter original "a" 1}}|{{#each this}}<span>{{@key}}:{{this}}</span>{{/each}}|{{else}}no{{/filter}}
	 * // Result: '|<span>a:1</span>||<span>a:1</span><span>b:2</span>|'
	 *
	 */
	return function filterHelper (...args) {

		const options = args.pop();
		if (!args.length) throw new Error('Handlebars Helper "filter" needs at least one parameter');

		const input = args.shift();
		let results;

		if (!args.length) results = filterUtil(input);
		else if (args.length === 1) results = filterUtil(input, args[0]);
		else results = filterUtil(input, args);

		if (!options.fn) return results;

		if (results && results.length > 0) {
			var data = Handlebars.createFrame(options.data);
			return results.map((result, i) => {
				data.index = i;
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
	// t.simple({
	// });
}
