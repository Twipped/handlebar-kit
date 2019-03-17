
exports.mul = function () {

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
	return function mul (...values) {
		if (values.length === 2 && !Array.isArray(values[0])) {
			throw new Error('Handlebars Helper "mul" needs at least 2 parameters minimum when passing non-arrays');
		}
		if (values.length === 1) {
			throw new Error('Handlebars Helper "mul" needs at least 1 parameter minimum');
		}

		var value;

		function descend (level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else if (value === undefined) {
				value = parseFloat(level);
			} else if (level) {
				level = parseFloat(level);
				value = value * parseFloat(level);
			}
		}

		descend(...values.slice(0, -1));

		return value;
	};
};
