import formatDistance from 'date-fns/formatDistance';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

export default function fromNow () {

	/**
	 * Outputs how much time has elapsed or will elapse between now and the passed date.
	 * @category date
	 * @name fromNow
	 *
	 * @signature {{fromNow input [parseFormat]}}
	 * @param {string|Date} input   The date value to be formatted. Must be either a Date object, parsable by Date(input), or parsable using a providing parsing string.
	 * @param {string} [parseFormat] If a `parse` argument is provided, it will be used for instructing how to parse the input. See the `date-fns` library for parsing string formats.
	 * @return {string}
	 */

	return function fromNowHelper (...args) {
		const options = args.pop();
		let input;

		switch (args.length) {
		case 0:
			throw new Error('Handlebars Helper "fromNow" needs at least 1 parameter');
		case 1:
			input = new Date(args[0]);
			break;
		case 2:
			input = parse(args[1], args[0]);
			break;
		default:
			return '';
		}

		if (!isValid(input)) {
			console.trace('Invalid input for Handlebars Helper "fromNow"', { input, ...options.hash }); // eslint-disable-line
			return '';
		}

		return formatDistance(new Date(), input);
	};

	/***/
}

export function test (t) {
	// t.simple({
	// });
}
