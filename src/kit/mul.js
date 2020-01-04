
import { flatten } from '../util';

export default function mul () {

	/**
	 * Multiplies two or more values.
	 * If more than two values are provided, the result of the previous two multiplications
	 * will be divided with the next. If any value is 0, the result of the division will be zero.
	 * @category math
	 * @name mul
	 *
	 * @signature {{mul value1 value2 ... valueN}}
	 * @param  {number} value1
	 * @param  {number} value2
	 * @param  {number} [valueN]
	 * @return {number}
	 */
	return function mulHelper (...args) {
		args.pop();

		if (args.length < 2) {
			throw new Error('Handlebars Helper "div" needs 1 parameter minimum');
		}

		args = flatten(args);

		const initial = args.shift();
		return args.reduce((a, b) => a * b, initial);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
