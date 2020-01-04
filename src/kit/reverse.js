
import { isString, isObject, isArray, isNumber, toPairs, fromPairs } from '../util';

export default function reverse () {

	/**
	 * Reverses the order of a string or array, negates an integer, or returns an object with the keys in reverse order
	 * @category collection,string,integer
	 * @name reverse
	 *
	 * @signature (reverse input)
	 * @param  {Array<mixed>|string|integer} input
	 * @return {Array<mixed>|string|integer}
	 */
	return function reverseHelper (input) {
		if (isString(input)) {
			return input.split('').reverse().join('');
		} else if (isNumber(input)) {
			return 0 - input;
		} else if (isArray(input)) {
			return input.reverse();
		} else if (isObject(input)) {
			return fromPairs(toPairs(input).reverse());
		}
		throw new Error('Handlebars Helper "reverse" cannot operate upon ' + (typeof input) + 's.');
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
