
exports.uppercase = function () {

	/**
	 * Uppercase the a string or content block
	 * @category strings
	 * @name uppercase
	 *
	 * @signature {{uppercase input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#uppercase}}<TEMPLATE>{{/uppercase}}
	 * @return {string}
	 */
	return function uppercase (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "uppercase" needs at least 1 parameter if not using as a block helper');
			}

			input = options.fn(this);
		}

		return String(input).toUpperCase();
	};
	/***/
};
