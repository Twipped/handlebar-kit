
export default function humanTime () {

	/**
	 * Convert a millisecond count into human readable time (minutes, hours, days)
	 * If the `short` parameter is truthy, then the function will use abbreviated duration units.
	 * By default the function returns the first major unit. If the `detailed` parameter is truthy,
	 * this will be extended to the smallest unit.
	 * @category strings
	 * @name humanTime
	 *
	 * @signature {{humanTime milliseconds [short=1] [detailed=1]}}
	 * @param  {number} milliseconds [description]
	 * @param  {boolean} short [description]
	 * @return {string}
	 */
	return function humanTimeHelper (milliseconds, options) {

		if (arguments.length !== 2) {
			throw new Error('Handlebars Helper "humanTime" needs 1 parameter');
		}

		var keysL = [ 'Year',      'Month',    'Week',    'Day',    'Hour',    'Minute',    'Second', 'Millisecond' ];
		var keysS = [ 'yr',        'mo',       'wk',      'd',      'h',       'm',         's',      'ms' ];
		var divs  = [ 31536000000, 2592000000, 604800000, 86400000, 3600000,   60000,       1000,     1 ];
		var stack = [];
		var level = 0;
		var value;

		var keys = options.hash.short ? keysS : keysL;

		milliseconds = Math.abs(milliseconds);

		while (milliseconds) {
			value = Math.floor(milliseconds / divs[level]);
			milliseconds = milliseconds % divs[level];
			if (value) {
				let pushable = value + ' ' + keys[level];
				if (!options.hash.short && value > 1) pushable += 's';
				stack.push(pushable);
				if (!options.hash.detailed) break;
			}
			level++;
		}

		return stack.join(' ');

	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
