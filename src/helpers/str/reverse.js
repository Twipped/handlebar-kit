
exports.reverse = function () {
	return function (input, options) {

		if (typeof input === 'string') {
			return input.split('').reverse().join('');
		} else if (typeof input === 'number') {
			return 0 - input;
		} else if (Array.isArray(input)) {
			return input.reverse();
		}
		throw new Error('Handlebars Helper "reverse" cannot operate upon ' + (typeof input) + 's.');


	};
};
