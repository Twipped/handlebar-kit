
exports.numberFormat = function () {

	/**
	 * Format a floating point number
	 * @category strings
	 * @name contains
	 *
	 * @signature {{numberFormat value [precision] [decimalPoint] [thousandsSeparator]}}
	 * @param  {number} value
	 * @param  {number} [precision]    Number of decimal points to display (default is 0)
	 * @param  {string} [decimalPoint] Character to use for the decimal point (Default is a single period)
	 * @param  {string} [thousandsSeparator]    Character to use to mark thousands (eg, 1,000) (Default is a single comma)
	 * @return {string}
	 */
	return function numberFormat (value, precision, decimalPoint, thousands) {
		// account for options argument
		var argc = arguments.length - 1;

		if (argc === 0) {
			throw new Error('Handlebars Helper "numberFormat" needs 1 parameter minimum');
		}

		if (argc === 3 || thousands === undefined) {
			thousands = ',';
		}

		if (!thousands) {
			thousands = '';
		}

		if (argc === 2 || decimalPoint === undefined) {
			decimalPoint = '.';
		}

		if (argc === 1 || precision === undefined) {
			precision = 0;
		} else {
			precision = parseInt(precision, 10);
		}

		// strip any non-numeric characters
		value = String(value).replace(/[^0-9+\-Ee.]/g, '');

		var result;
		if (precision) {
			// round at the needed precision and then split on the decimal.
			var k = Math.pow(10, precision);
			result = String(Math.round(value * k) / k).split('.');

			// if no decimal existed, make sure we create a place for it.
			if (result.length === 1) result.push('');
		} else {
			// parse as float and round off, then store in an array to simplify below.
			result = [ Math.round(parseFloat(value)) ];
		}

		// insert any thousands marks as needed
		if (thousands) {
			result[0] = String(result[0]).replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands);
		}

		// pad out the decimal places as needed
		if (precision && result[1].length < precision) {
			result[1] += new Array(precision - result[1].length + 1).join('0');
		}

		return precision ? result.join(decimalPoint) : result[0];

	};
};
