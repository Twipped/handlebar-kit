
exports.pow = function () {

	/**
	 * Returns the base to the exponent power
	 * @category math
	 * @name pow
	 *
	 * @signature {{pow base exponent}}
	 * @param  {number} base
	 * @param  {number} exponent
	 * @return {number}
	 */
	return function pow (base, exponent) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "pow" needs at least 2 parameters');
		}

		return Math.pow(base, exponent);
	};
};
