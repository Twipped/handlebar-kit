
exports.replace = function () {
	return function (haystack, needle, replacement, options) {
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
};
