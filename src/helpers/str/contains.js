
exports.contains = function () {
	return function (haystack, needle, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 3) {
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
