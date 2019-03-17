
exports.floor = function () {

	/**
	 * Rounds down the passed value
	 * @category math
	 * @name  floor
	 *
	 * @signature {{ceil value}}
	 * @param  {float} value
	 * @return {integer}
	 */

	return function floor (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "floor" needs 1 parameter minimum');
		}

		return Math.floor(value);
	};
};
