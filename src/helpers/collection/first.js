
exports.first = function (Handlebars) {
	/**
	 * Returns the first N items in the passed array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{first input[ count]}}
	 * @param  {Array|Object|String}  input Collection or String
	 * @param  {Number} [count] Number of items to exclude
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#first input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/first}}
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#first items, 2}}<span>{{this}}</span>{{/first}}
	 * // Result: <span>a</span><span>b</span>
	 */
	return function first (input, count, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "first" needs 2 parameters');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			count = 1;
		}

		if (!options.fn) {
			if (input && typeof input === 'object' && !Array.isArray(input)) {
				input = Object.values(input);
			}
			if (Array.isArray(input) || typeof input === 'string') return count > 1 ? input.slice(0, count) : input[0];
		} else {

			// received a string
			if (typeof input === 'string') {
				if (!input.length) return options.inverse(this);
				return options.fn(result, input.slice(0, count));
			}

			var data = Handlebars.createFrame(options.data);

			// received an object collection
			if (input && typeof input === 'object' && !Array.isArray(input)) {
				var keys = Object.keys(input);
				if (!keys.length) {
					return options.inverse(this);
				}

				return keys.slice(0, count).map((key, i) => {
					var result = input[key];
					data.index = i;
					data.key = key;
					data.first = (i === 0);
					data.last  = (i === keys.length - 1);
					return options.fn(result, { data });
				}).join('');
			}

			var results = count ? input.slice(0, count) : [ input[0] ];
			if (!results.length) {
				return options.inverse(this);
			}

			return results.map((result, i) => {
				data.index = i;
				data.key = i;
				data.first = (i === 0);
				data.last  = (i === results.length - 1);
				return options.fn(result, { data });
			}).join('');
		}
	};
	/***/
};
