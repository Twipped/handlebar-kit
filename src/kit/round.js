
export default function round () {

	/**
	 * Rounds the passed floating point to the nearest whole number
	 * @category math
	 * @name round
	 *
	 * @signature {{round value}}
	 * @param  {number} value
	 * @return {number}
	 */
	return function roundHelper (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "round" needs 1 at least parameter');
		}

		return Math.round(value);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
