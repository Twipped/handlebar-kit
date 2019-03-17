
exports.any = function () {

	function truthy (value) {
		if (Array.isArray(value)) return !!value.length;
		return !!value;
	}

	/**
	 * Tests if any of the values in the provided array or object are truthy.
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{any input}}
	 * @param  {array<mixed>|object<mixed>} input Array containing any truthy values, or an object with any property that is truthy
	 * @return {boolean}
	 *
	 * @signature {{#any input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/any}}
	 * @example
	 * {{#any flags}}Sore or all flags are true.{{else}}None of the flags are true.{{/any}}
	 */
	return function any (input, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "any" needs 1 parameter');
		}
		var i; var c; var yes = false;
		if (Array.isArray(input)) {
			for (i = 0, c = input.length; i < c; i++) {
				if (truthy(input[i])) {
					yes = true;
					break;
				}
			}
		} else if (input && typeof input === 'object') {
			var keys = Object.keys(input);
			for (i = 0, c = keys.length; i < c; i++) {
				if (truthy(input[keys[i]])) {
					yes = true;
					break;
				}
			}
		} else if (input) {
			yes = !!input;
		}

		if (!options.fn) return yes || '';

		return yes ? options.fn(this) : options.inverse(this);
	};
	/***/
};
