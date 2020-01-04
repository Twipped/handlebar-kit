
export default function ceil () {

	/**
	 * Rounds up the passed value
	 * @category math
	 * @name  ceil
	 *
	 * @signature {{ceil value}}
	 * @param  {float} value
	 * @return {integer}
	 */
	return function ceilHelper (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "ceil" needs 1 parameter minimum');
		}

		return Math.ceil(parseFloat(value));
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
