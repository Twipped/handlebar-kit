
exports.all = function () {

	function truthy (value) {
		if (Array.isArray(value)) return !!value.length;
		return !!value;
	}

	/**
	 * Tests if all of the values in the provided array or object are truthy.
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{all input}}
	 * @param  {array<mixed>|object<mixed>} input Array whose values must all be truthy, or an object whose properties must all be truthy
	 * @return {boolean}
	 *
	 * @signature {{#all input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
	 * @example
	 * {{#all flags}}All flags are true.{{else}}Some or none of the flags are true.{{/all}}
	 */
	return function all (input, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "all" needs 1 parameter');
		}

		if (input && typeof input === 'object' && !Array.isArray(input)) {
			input = Object.values(input);
		}

		var yes = true;
		if (Array.isArray(input)) {
			for (let i = 0; i < input.length; i++) {
				if (!(yes = yes && truthy(input[i]))) break;
			}
		} else {
			yes = truthy(input);
		}

		if (!options.fn) return yes || '';

		return yes ? options.fn(this) : options.inverse(this);
	};
	/***/
};
