
exports.padCenter = function () {
	return function (input, length, using, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "padCenter" needs 2 parameters minimum');
			}

			input = options.fn(this);
			length = options.hash && options.hash.size || 0;
			using = options.hash && options.hash.using || ' ';

			break;
		case 2:
			length = options.hash && options.hash.size || 0;
			using = options.hash && options.hash.using || ' ';
			break;
		case 3:
			using = options.hash && options.hash.using || ' ';
			break;
		default:
		 	// do nothing
		}

		// make sure we've got a string
		input = String(input);

		if (length < input.length) {
			return input;
		}

		var len   = input.length;
		var left  = Math.floor((length - len) / 2);
		var right = Math.ceil((length - len) / 2);

		return new Array(left + 1).join(using) + input + new Array(right + 1).join(using);

	};
};
