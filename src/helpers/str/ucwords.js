
exports.ucwords = function () {

	/**
	 * Uppercase the first letter of every word in a string or content block
	 * @category strings
	 * @name ucwords
	 *
	 * @signature {{ucwords input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#ucwords}}<TEMPLATE>{{/ucwords}}
	 * @return {string}
	 */
	return function ucwords (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (options.fn) {
				input = options.fn(this);
			} else {
				throw new Error('Handlebars Helper "ucwords" needs 1 parameter minimum');
			}
		}

		if (input && typeof input === 'string') {
			return input.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1));
		}
		return '';

	};
	/***/
};
