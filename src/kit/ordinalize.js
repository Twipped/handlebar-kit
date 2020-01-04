
export default function ordinalize () {

	/**
	 * Adds a ordinal suffix to a number (eg, 1st, 2nd, 3rd)
	 * @category strings
	 * @name ordinalize
	 *
	 * @signature {{ordinalize value}}
	 * @param  {number} value
	 * @return {string}
	 */
	return function ordinalizeHelper (value) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "ordinalize" needs 1 parameter');
		}

		var normal = Math.abs(Math.round(value));
		value = String(value);
		if ([ 11, 12, 13 ].indexOf(normal % 100) >= 0) {
			return value + 'th';
		}
		switch (normal % 10) {
		case 1:
			return value + 'st';
		case 2:
			return value + 'nd';
		case 3:
			return value + 'rd';
		default:
			return value + 'th';
		}

	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
