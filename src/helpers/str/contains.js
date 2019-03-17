
exports.contains = function () {

	/**
	 * Tests if the needle value exists inside the haystack
	 * @category strings
	 * @name contains
	 *
	 * @signature {{contains haystack needle [regex=true]}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe Returns true if the haystack contains the needle
	 * @return {boolean}
	 *
	 * @signature {{#contains haystack needle [regex=true]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/contains}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe If the string does contain that value, block will evaluate with the result value as the current context ({this}).
	 */
	return function contains (haystack, needle, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "contains" needs 2 parameters');
		}

		// make sure we have strings
		haystack = String(haystack);
		needle = String(needle);

		if (options.hash && options.hash.regex) {
			needle = new RegExp(needle);
		}

		var result = haystack.split(needle).length - 1;

		if (!options.fn) {
			return result;
		}

		return result ? options.fn(this) : options.inverse(this);

	};
};
