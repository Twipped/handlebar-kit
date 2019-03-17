
exports.values = function (Handlebars) {
	/**
	 * Returns the values of an array or object.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{values input}}
	 * @param  {array<mixed>|object} input
	 * @return {array<mixed>}
	 *
	 * @signature {{#values}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/values}}
	 */
	return function values (input, options) {
		if (!Array.isArray(input) && typeof input === 'object') {
			input = Object.keys(input).map((k) => input[k]);
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
