
exports.keys = function (Handlebars) {
	/**
	 * Returns the indexes of an array or the keys of an object.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{keys input}}
	 * @param  {array<mixed>|object} input
	 * @return {array<integer|string>}
	 *
	 * @signature {{#keys}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/keys}}
	 */
	return function keys (input, options) {
		if (!Array.isArray(input) && typeof input === 'object') {
			input = Object.keys(input);
		} else {
			input = input.map((v, k) => k);
		}

		if (!options.fn) {
			return input;
		}
		if (input.length) {
			var data = Handlebars.createFrame(options.data);
			return input.map((result, i) => {
				data.index = i;
				data.first = (i === 0);
				data.last  = (i === input.length - 1);
				return options.fn(result, { data });
			}).join('');
		}
		return options.inverse(this);


	};
	/***/
};
