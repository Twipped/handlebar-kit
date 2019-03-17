
exports.reverse = function () {

	/**
	 * Reverses the order of a string or array, or negates an integer.
	 * @category collection
	 * @name reverse
	 *
	 * @signature (reverse input)
	 * @param  {Array<mixed>|string|integer} input
	 * @return {Array<mixed>|string|integer}
	 */
	return function reverse (input) {
		if (typeof input === 'string') {
			return input.split('').reverse().join('');
		} else if (typeof input === 'number') {
			return 0 - input;
		} else if (Array.isArray(input)) {
			return input.reverse();
		}
		throw new Error('Handlebars Helper "reverse" cannot operate upon ' + (typeof input) + 's.');
	};
	/***/
};
