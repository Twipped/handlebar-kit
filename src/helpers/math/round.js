
exports.round = function () {

	/**
	 * Rounds the passed floating point to the nearest whole number
	 * @category math
	 * @name round
	 *
	 * @signature {{round value}}
	 * @param  {number} value
	 * @return {number}
	 */
	return function round (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "round" needs 1 at least parameter');
		}

		return Math.round(value);
	};
	/***/
};
