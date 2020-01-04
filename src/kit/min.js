
import { flatten } from '../util';

export default function min () {

	/**
	 * Finds the minimum of all passed values
	 * @category math
	 * @name min
	 *
	 * @signature {{min value1 value2 ... valueN}}
	 * @param  {number} value1
	 * @param  {number} value2
	 * @param  {number} [valueN]
	 * @return {number}
	 */
	return function minHelper (...args) {
		args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "max" needs at least 2 parameters');
		}

		return Math.min(...flatten(args));
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
