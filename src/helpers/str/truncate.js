
exports.truncate = function () {
	return function (input, length, suffix, options) {
		options = arguments[arguments.length - 1];

		var hashLength = options.hash && options.hash.length;
		var hashSuffix = options.hash && options.hash.suffix;

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "truncate" needs 2 parameters minimum');
			} else if (hashLength === undefined) {
				throw new Error('Handlebars Helper "truncate" needs a length');
			} else {
				input = options.fn(this);
				length = hashLength || 0;
				suffix = hashSuffix || '\u2026';
			}
			break;

		case 2:
			if (options.fn) {
				input = options.fn(this);
				length = arguments[0];
				suffix = hashSuffix || '\u2026';
			} else {
				if (hashLength === undefined) {
					throw new Error('Handlebars Helper "truncate" needs 2 parameters minimum');
				}
				length = hashLength;
			}
			break;

		case 3:
			if (options.fn) {
				input = options.fn(this);
				length = arguments[0];
				suffix = hashSuffix || '\u2026';
			} else {
				suffix = hashSuffix || '\u2026';
			}
			break;
		default: // do nothing
		}

		// make sure we've got a string
		input = String(input);

		if (length > input.length) {
			return input;
		}

		return input.substring(0, length - suffix.length).replace(/^\s+|\s+$/gm, '') + suffix;
	};
};
