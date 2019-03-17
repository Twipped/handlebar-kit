
exports.mean = function () {

	/**
	 * Find the mean average of all values provided
	 * @category math
	 * @name mean
	 *
	 * @signature {{mean value1 value2 ... valueN}}
	 * @param {...[Array<number>|number]} values Numbers or arrays of numbers to be averaged
	 * @return {number} Returns the mean average of all values passed in
	 */
	return function mean (...values) {
		if (arguments.length <= 1) {
			throw new Error('Handlebars Helper "add" needs 1 parameter minimum');
		}

		var result = 0;
		var count = 0;

		function descend (level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				result += parseFloat(level);
				count++;
			}
		}

		descend(...values.slice(0, -1));

		return count ? (result / count) : 0;

	};
};
