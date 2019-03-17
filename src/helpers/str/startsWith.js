
exports.startsWith = function () {

	/**
	 * Tests if the haystack starts with the needle
	 * @category strings
	 * @name startsWith
	 *
	 * @signature {{startsWith haystack needle}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe Returns true if the haystack ends with the needle
	 * @return {boolean}
	 *
	 * @signature {{#startsWith haystack needle}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/startsWith}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe If the string does contain that value, block will evaluate with the result value as the current context ({this}).
	 */
	return function startsWith (haystack, needle, options) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "startsWith" needs 2 parameters');
		}

		// make sure we have strings
		haystack = String(haystack);
		needle = String(needle);

		var result = haystack.substr(0, needle.length) === needle;

		if (!options.fn) {
			return result || '';
		}

		return result ? options.fn(this) : options.inverse(this);
	};
	/***/
};
