
import { arrayify, truthy } from '../util';

export default function any () {

	/**
	 * Tests if any of the values in the provided array or object are truthy.
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{any input}}
	 * @param  {array<mixed>|object<mixed>} input Array containing any truthy
	 * values, or an object with any property that is truthy
	 * @return {boolean}
	 *
	 * @signature {{#any input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/any}}
	 * @example
	 * {{#any flags}}Sore or all flags are true.{{else}}None of the flags are true.{{/any}}
	 *
	 * @signature {{any arg1 [... argN]}}
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 * @return {boolean} Returns the first truthy value, or an empty string.
	 *
	 * @signature {{#any arg1 [... argN]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
	 * @describe Truthy block will evaluate if any of the values are truthy.
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 */
	return function anyHelper (...args) {
		const options = args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "any" needs 1 parameter');
		}

		let input;
		if (args.length > 1) {
			input = args;
		} else {
			input = arrayify(args[0]);
		}

		let result = false;
		for (const value of input) {
			if (truthy(value)) {
				result = value;
				break;
			}
		}

		if (!options.fn) return result || '';

		return result ? options.fn(this) : options.inverse(this);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
