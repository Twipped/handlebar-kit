
import { flatten } from '../util';

export default function sub () {

	/**
	 * Subtracts one or more values from the first value
	 * If more than two values are provided, the result of the previous subtraction will be subtracted from the next.
	 * @category math
	 * @name sub
	 *
	 * @signature {{sub value1 value2 ... valueN}}
	 * @param  {number} value1
	 * @param  {number} value2
	 * @param  {number} [valueN]
	 * @return {number}
	 */
	return function subHelper (...args) {
		args.pop();

		if (args.length <= 1) {
			throw new Error('Handlebars Helper "sub" needs 1 parameter minimum');
		}

		args = flatten(args);

		const initial = args.shift();
		return args.reduce((a, b) => a - b, initial);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
