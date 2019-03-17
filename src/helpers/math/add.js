
exports.add = function () {

	/**
	 * Add all values provided and return the result
	 * @category math
	 * @name add
	 *
	 * @signate {{add value1 value2 ... valueN}}
	 * @param {...[Array<number>|number]} values Numbers or arrays of numbers to be added together
	 * @return {number}
	 */
	return function add (...values) {
		if (values.length <= 1) {
			throw new Error('Handlebars Helper "add" needs 1 parameter minimum');
		}

		var result = 0;

		function descend (level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				result += parseFloat(level);
			}
		}

		descend(...values.slice(0, -1));

		return result;
	};
};
