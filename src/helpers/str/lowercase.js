
exports.lowercase = function () {

	/**
	 * Lowercase the a string or content block
	 * @category strings
	 * @name lowercase
	 *
	 * @signature {{lowercase input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#lowercase}}<TEMPLATE>{{/lowercase}}
	 * @return {string}
	 */
	return function lowercase (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (options.fn) {
				input = options.fn(this);
			} else {
				throw new Error('Handlebars Helper "lowercase" needs 1 parameter minimum');
			}
		}

		return String(input).toLowerCase();
	};
	/***/
};
