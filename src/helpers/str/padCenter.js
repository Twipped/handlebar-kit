
exports.padCenter = function () {

	/**
	 * Pads a string with characters on both sides to fill to center the text.
	 * If the input is an odd number of characters in length and the desired size is even
	 * the function will favor to the left.
	 * @category strings
	 * @name padCenter
	 *
	 * @signature {{padCenter input length [using]}}
	 * @param  {string} input
	 * @param  {number} length
	 * @param  {string} [using] Optional character to pad with. Defaults to a single space.
	 * @return {string}
	 */
	return function padCenter (input, length, using, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "padCenter" needs at least 2 parameters');
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
		default: // do nothing
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
	/***/
};
