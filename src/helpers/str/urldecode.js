
exports.urldecode = function () {

	/**
	 * Parses URI encoded string back into its original format
	 * @category strings
	 * @name urldecode
	 *
	 * @signature {{urldecode input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#urldecode}}<TEMPLATE>{{/urldecode}}
	 * @return {string}
	 */
	return function urldecode (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 2) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "urldecode" needs 1 parameter minimum');
			}

			input = options.fn(this);
		}

		return decodeURIComponent(input);

	};
	/***/
};
