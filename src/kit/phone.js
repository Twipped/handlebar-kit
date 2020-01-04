
export default function phone () {

	/**
	 * Strips non-numeric characters and reformats as a US phone number (eg (XXX) XXX-XXXX)
	 * Returns the value stripped of non-numerics if the result is not ten digits long
	 * @category strings
	 * @name phone
	 *
	 * @signature {{phone number}}
	 * @param  {string|number} number
	 * @return {string}
	 */
	return function phoneHelper (number) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "phoneNumber" needs 1 parameter minimum');
		}

		// strip non digits
		number = String(number).replace(/[^0-9]/, '');

		if (number.length < 10) {
			return number;
		}

		var stack = [ '(', number.substr(-10, 3), ') ', number.substr(-7, 3), '-', number.substr(-4) ];

		if (number.length > 10) {
			stack.unshift(number.substr(0, number.length - 10) + ' ');
		}

		return stack.join('');
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
