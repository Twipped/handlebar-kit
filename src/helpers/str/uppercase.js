
exports.uppercase = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "uppercase" needs 1 parameter minimum');
			}

			input = options.fn(this);
		}

		return String(input).toUpperCase();
	};
};
