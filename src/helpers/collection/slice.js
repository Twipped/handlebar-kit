
exports.slice = function (Handlebars) {
	/**
	 * Returns a slice of an array, object map, or string
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections,strings
	 * @signature {{slice input start[ count]}}
	 * @param  {array<mixed>} input
	 * @param  {integer} start  Index to slice from
	 * @param  {integer} [count]  Number of items to slice.
	 * @return {array}
	 *
	 * @signature {{#slice input start[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/slice}}
	 */
	return function slice (input, start, count, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			throw new Error('Handlebars Helper "slice" needs 2 parameters');
		case 2:
			start = undefined;
			count = undefined;
			break;
		case 3:
			count = undefined;
			break;
		default: // do nothing
		}

		if (typeof input === 'object' && !Array.isArray(input)) {
			input = Object.values(input);
		}

		if (typeof input !== 'string' && !Array.isArray(input)) {
			throw new Error('Handlebars Helper "slice" did not receive a string or collection.');
		}

		var results = input.slice(start, count);

		if (!options.fn) {
			return results;
		}

		if (typeof input === 'string') {
			if (input.length) {
				return options.fn(results);
			}
			return options.inverse(this);
		}

		if (results.length) {
			var data = Handlebars.createFrame(options.data);
			return results.map((result, i) => {
				data.index = i;
				data.first = (i === 0);
				data.last  = (i === results.length - 1);
				return options.fn(result, { data });
			}).join('');
		}
		return options.inverse(this);

	};
	/***/
};
