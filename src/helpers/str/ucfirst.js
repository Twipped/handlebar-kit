
exports.ucfirst = function () {

	/**
	 * Uppercase the first letter of a string or content block
	 * @category strings
	 * @name ucfirst
	 *
	 * @signature {{ucfirst input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#ucfirst}}<TEMPLATE>{{/ucfirst}}
	 * @return {string}
	 */
	return function ucfirst (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (options.fn) {
				input = options.fn(this);
			} else {
				throw new Error('Handlebars Helper "ucfirst" needs 1 parameter minimum');
			}
		}

		if (input && typeof input === 'string') {
			return input.charAt(0).toUpperCase() + input.slice(1);
		}
		return '';

	};
	/***/
};
