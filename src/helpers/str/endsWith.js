
exports.endsWith = function () {

	/**
	 * Tests if the needle value exists inside the haystack
	 * @category strings
	 * @name endsWith
	 *
	 * @signature {{endsWith haystack needle}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe Returns true if the haystack ends with the needle
	 * @return {boolean}
	 *
	 * @signature {{#endsWith haystack needle}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/endsWith}}
	 * @param  {string} haystack String to search inside
	 * @param  {string} needle String to search for. If `regex=true` then the string is evaluated as a regular expression.
	 * @describe If the string does contain that value, block will evaluate with the result value as the current context ({this}).
	 */
	return function endsWith (haystack, needle, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "endsWith" needs 2 parameters');
		}

		// make sure we have strings
		haystack = String(haystack);
		needle = String(needle);

		var result = haystack.substr(-needle.length) === needle;

		if (!options.fn) {
			return result || '';
		}

		return result ? options.fn(this) : options.inverse(this);
	};
};
