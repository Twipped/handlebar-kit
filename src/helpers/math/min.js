
exports.min = function () {

	/**
	 * Finds the minimum of all passed values
	 * @category math
	 * @name min
	 *
	 * @signature {{min value1 value2 ... valueN}}
	 * @param  {number} value1
	 * @param  {number} value2
	 * @param  {number} [valueN]
	 * @return {number}
	 */
	return function min (...values) {
		if (values.length <= 1) {
			throw new Error('Handlebars Helper "min" needs at least 1 parameter');
		}

		var value;

		function descend (level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else if (value === undefined) {
				value = parseFloat(level);
			} else {
				value = Math.min(value, parseFloat(level));
			}
		}

		descend(...values.slice(0, -1));

		return value;
	};
};
