
import dateFormat from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

export default function date () {

	/**
	 * Outputs a date formatted using moment notation.
	 * Depends on the `moment` library. Moment will be searched for by first accessing a
	 * `require` function (if present) before checking global contexts.
	 * @category date
	 * @name date
	 *
	 * @signature {{date format}}
	 * @describe Outputs the current date/time
	 * @param  {string} format  Moment formatting
	 * @return {string}
	 *
	 * @signature {{date input format [parse=<string>]}}
	 * @param  {string} format  Moment formatting
	 * @param  {string|Date} input   The date value to be formatted. Must be either a
	 * Date object, parsable by Date(input), or parsable using a providing parsing string.
	 * @param {string} [parse] If a `parse` attribute is provided, it will be used for
	 * instructing moment on how to parse the input.
	 * @return {string}
	 */

	return function dateHelper (...args) {
		const options = args.pop();
		let format, input;

		switch (args.length) {
		case 0:
			format = 'YYYY-MM-DD HH:mm:ss';
			input = new Date();
			break;
		case 1:
			format = args[0];
			input = new Date();
			break;
		case 2:
			var parsePattern = options.hash && options.hash.parse || undefined;
			if (parse) {
				input = parse(parsePattern, args[0]);
			} else {
				input = new Date(args[0]);
			}
			format = args[1];
			break;
		default:
			return '';
		}

		if (!isValid(input)) {
			console.trace('Invalid input for Handlebars Helper "date"', { input, ...options.hash }); // eslint-disable-line
			return '';
		}

		return dateFormat(input, format);
	};

	/***/
}

export function test (t) {
	// t.simple({
	// });
}
