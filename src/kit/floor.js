
export default function floor () {

	/**
	 * Rounds down the passed value
	 * @category math
	 * @name  floor
	 *
	 * @signature {{ceil value}}
	 * @param  {float} value
	 * @return {integer}
	 */

	return function floorHelper (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "floor" needs 1 parameter minimum');
		}

		return Math.floor(value);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
