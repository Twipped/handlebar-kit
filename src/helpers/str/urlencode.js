
exports.urlencode = function () {

	/**
	 * Encodes a string into a URL safe format that can be decoded.
	 * @category strings
	 * @name urlencode
	 *
	 * @signature {{urlencode input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#urlencode}}<TEMPLATE>{{/urlencode}}
	 * @return {string}
	 */

	return function urlencode (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 2) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "urlencode" needs 1 parameter minimum');
			}

			input = options.fn(this);
		}

		return encodeURIComponent(input);

	};
	/***/
};
