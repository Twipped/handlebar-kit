
exports.ucsentences = function () {

	/**
	 * Uppercase the first letter of every sentence in a string or content block
	 * @category strings
	 * @name ucsentences
	 *
	 * @signature {{ucsentences input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#ucsentences}}<TEMPLATE>{{/ucsentences}}
	 * @return {string}
	 */
	return function ucsentences (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (options.fn) {
				input = options.fn(this);
			} else {
				throw new Error('Handlebars Helper "ucwords" needs 1 parameter minimum');
			}
		}

		if (input && typeof input === 'string') {
			return input.replace(/((?:\S[^.?!]*)[.?!]*)/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		}
		return '';

	};
	/***/
};
