
exports.replace = function () {

	/**
	 * Searches for a needle within a haystack and substitutes a replacement for that match.
	 * Pass a truthy value for the `regex` parameter to use a regular expression as the needle.
	 * @category strings
	 * @name replace
	 *
	 * @signature {{replace haystack needle replacement [regex=1]}}
	 * @param  {[type]} haystack
	 * @param  {[type]} needle
	 * @param  {[type]} replacement
	 * @return {[type]}
	 */
	return function replace (haystack, needle, replacement, options) {
		options = arguments[arguments.length - 1];

		var hashNeedle = options.hash && options.hash.search;
		var hashReplace = options.hash && options.hash.replace;
		var hashRegex = options.hash && options.hash.regex;

		switch (arguments.length) {
		case 1:
			if (options.fn) {
				haystack = options.fn(this);
				needle = hashNeedle;
				replacement = hashReplace || '';
			} else if (hashNeedle === undefined) {
				throw new Error('Handlebars Helper "replace" needs a search string');
			}
			break;

		case 2:
			if (options.fn) {
				haystack = options.fn(this);
				needle = hashNeedle || arguments[0];
				replacement = hashReplace || '';
			} else {
				if (hashNeedle === undefined) {
					throw new Error('Handlebars Helper "replace" needs a search string');
				}

				needle = hashNeedle || arguments[0];
				replacement = hashReplace || '';
			}
			break;
		case 3:
			if (options.fn) {
				haystack = options.fn(this);
				needle = hashNeedle || arguments[0];
				replacement = hashReplace || arguments[1];
			} else {
				replacement = '';
			}
			break;
		default: // do nothing
		}

		if (hashRegex) {
			needle = new RegExp(needle);
		}

		return haystack.replace(needle, replacement);

	};
	/***/
};
