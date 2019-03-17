
exports.or = function () {

	function truthy (value) {
		if (Array.isArray(value)) {
			if (value.length) return true;
			return false;
		}
		return !!value;
	}

	/**
	 * Tests if any of the passed arguments are truthy.
	 * Empty arrays are counted as being falsy.
	 * May be used inline or as a conditional block.
	 * @name or
	 * @category comparisons
	 *
	 * @signature {{or arg1 [... argN]}}
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 * @return {boolean} Returns the first truthy argument found, or last argument if none found.
	 *
	 * @signature {{#or arg1 [... argN]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/or}}
	 * @describe Truthy block will evaluate with the truthy value as the current context ({this}).
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 */

	return function or (options) {
		var args = [].slice.call(arguments);
		options = args.pop();

		var i = 0;
		var c = args.length;
		var result;


		for (; i < c; i++) {
			result = args[i];
			if (truthy(result)) {
				break;
			}
		}

		if (!options.fn) return result;

		if (truthy(result)) {
			return options.fn(result);
		}
		return options.inverse(this);

	};

	/***/
};
