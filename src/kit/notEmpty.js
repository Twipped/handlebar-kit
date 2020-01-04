
import { sizeOf } from '../util';

export default function notEmpty () {
	/**
	 * Tests if the provided input is not empty (string, array or object)
	 * May be used inline or as a conditional block.
	 *
	 * @category collections,strings
	 * @signature {{notEmpty input}}
	 * @param  {string|array|object} input
	 * @return {boolean}
	 *
	 * @signature {{#notEmpty input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/notEmpty}}
	 * @example
	 * // items = ['a']
	 * {{#notEmpty items}}is not empty{{else}}is empty{{/notEmpty}}
	 * // Result: 'is not empty'
	 */
	return function notEmptyHelper (...args) {
		const options = args.pop();
		const [ input ] = args;

		var result = !!sizeOf(input);

		if (!options.fn) {
			return result || '';
		}
		return result ? options.fn(this) : options.inverse(this);

	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}