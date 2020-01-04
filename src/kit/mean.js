
import { flatten } from '../util';

export default function mean () {

	/**
	 * Find the mean average of all values provided
	 * @category math
	 * @name mean
	 *
	 * @signature {{mean value1 value2 ... valueN}}
	 * @param {...[Array<number>|number]} values Numbers or arrays of numbers to be averaged
	 * @return {number} Returns the mean average of all values passed in
	 */
	return function meanHelper (...args) {
		args.pop();

		if (args.length <= 1) {
			throw new Error('Handlebars Helper "add" needs 1 parameter minimum');
		}

		args = flatten(args);

		const sum = args.reduce((a, b) => a + b, 0);
		return args.length ? sum / args.length : 0;
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
