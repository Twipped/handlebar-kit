
import { isArray, isString } from '../util';

export default function endsWith () {

	/**
	 * Tests if the haystack ends with the needle value
	 * @category strings
	 * @name endsWith
	 *
	 * @signature {{endsWith haystack needle}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe Returns true if the haystack ends with the needle
	 * @return {boolean}
	 *
	 * @signature {{#endsWith haystack needle}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/endsWith}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe If the string does contain that value, block will evaluate with the result value as the current context ({this}).
	 */
	return function endsWithHelper (...args) {
		if (args.length !== 3) {
			throw new Error('Handlebars Helper "endsWith" needs 2 parameters');
		}

		const options = args.pop();
		const [ haystack, needle ] = args;
		let result;

		if (isArray(haystack)) {
			result = haystack[haystack.length - 1] === needle;
		} else if (isString(haystack)) {
			result = haystack.endsWith(needle);
		} else {
			result = false;
		}

		if (!options.fn) {
			return result;
		}

		return result ? options.fn(this) : options.inverse(this);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
