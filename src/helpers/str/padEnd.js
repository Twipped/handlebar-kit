
exports.padEnd = function () {

	/**
	 * Pads a string with characters on the right side.
	 * @category strings
	 * @name padEnd
	 *
	 * @signature {{padEnd input length [using]}}
	 * @param  {string} input
	 * @param  {number} length
	 * @param  {string} [using] Optional character to pad with. Defaults to a single space.
	 * @return {string}
	 */
	return function padEnd (input, length, using, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "padEnd" needs 2 parameters minimum');
			}

			input = options.fn(this);
			length = options.hash && options.hash.size || 0;
			using = options.hash && options.hash.using || ' ';
			break;
		case 2:
			length = options.hash && options.hash.size || 0;
			using = ' ';
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

		return input + (new Array(length - input.length + 1)).join(using);

	};
	/***/
};
