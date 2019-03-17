
exports.humanNumber = function () {

	/**
	 * Converts a whole number into an abbreviated form (eg, 1200000 into 1.2M)
	 * @category strings
	 * @name humanNumber
	 *
	 * @signature {{humanNumber value [precision]}}
	 * @param  {number} number
	 * @param  {number} precision Optional number of decimal places to abbreviate to (default is 0)
	 * @return {string}
	 */
	return function humanNumber (number, precision) {
		if (arguments.length < 1) {
			throw new Error('Handlebars Helper "humanNumber" needs at least 1 parameter');
		}

		if (arguments.length === 2 || precision === undefined) {
			precision = 1;
		} else {
			precision = Math.pow(10, precision);
		}

		var abbr = [ 'K', 'M', 'B', 'T' ];

		var i = abbr.length - 1;

		while (i >= 0) {
			var size = Math.pow(10, (i + 1) * 3);
			if (size <= number) {
				number = Math.round(number * precision / size) / precision;

				// Special case where we round up to the next abbreviation
				if ((number === 1000) && (i < abbr.length - 1)) {
					number = 1;
					i++;
				}

				number += abbr[i];
				break;
			}
			i--;
		}
		return number;
	};
	/***/
};
