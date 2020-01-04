
import { all as allUtil } from '../util';

export default function all () {

	/**
	 * Tests if all of the values in the provided array or object are truthy.
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{all input}}
	 * @param  {array<mixed>|object<mixed>} input Array whose values must all be truthy,
	 * or an object whose properties must all be truthy
	 * @return {boolean}
	 *
	 * @signature {{#all input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
	 * @example
	 * {{#all flags}}All flags are true.{{else}}Some or none of the flags are true.{{/all}}
	 *
	 * @signature {{all arg1 [... argN]}}
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 * @return {mixed} Returns the first last argument if all are truthy, or else an empty string.
	 *
	 * @signature {{#all arg1 [... argN]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
	 * @describe Truthy block will evaluate if all values are truthy. ({this}).
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 */
	return function allHelper (...args) {

		const options = args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "all" needs 1 parameter');
		}

		const result = allUtil(...args);

		if (!options.fn) return result || '';

		return result ? options.fn(this) : options.inverse(this);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
