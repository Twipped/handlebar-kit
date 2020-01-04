
import { flatten } from '../util';

export default function max () {

	/**
	 * Finds the maximum of all passed values
	 * @category math
	 * @name max
	 *
	 * @signature {{max value1 value2 ... valueN}}
	 * @param  {number} value1
	 * @param  {number} value2
	 * @param  {number} [valueN]
	 * @return {number}
	 */
	return function maxHelper (...args) {
		args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "max" needs at least 2 parameters');
		}

		return Math.max(...flatten(args));
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
