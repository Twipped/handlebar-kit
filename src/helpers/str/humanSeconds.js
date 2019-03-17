
exports.humanSeconds = function () {

	/**
	 * Convert a second count into human readable time (minutes, hours, days)
	 * If the `short` parameter is truthy, then the function will use abbreviated duration units.
	 * By default the function returns the first major unit. If the `detailed` parameter is truthy,
	 * this will be extended to the smallest unit.
	 * @category strings
	 * @name humanSeconds
	 *
	 * @signature {{humanSeconds seconds [short=1] [detailed=1]}}
	 * @param  {number} seconds [description]
	 * @param  {boolean} short [description]
	 * @return {string}
	 */
	return function humanSeconds (seconds, options) {

		if (arguments.length !== 2) {
			throw new Error('Handlebars Helper "humanSeconds" needs 1 parameter');
		}

		var keysL = [ 'Year',      'Month',    'Week',    'Day',    'Hour',    'Minute',   'Second' ];
		var keysS = [ 'yr',        'mo',       'wk',      'd',      'h',       'm',        's' ];
		var divs  = [ 31536000,    2592000,    604800,    86400,    3600,      60,         1 ];
		var stack = [];
		var level = 0;
		var value;

		var keys = options.hash.short ? keysS : keysL;

		seconds = Math.abs(seconds);

		while (seconds) {
			value = Math.floor(seconds / divs[level]);
			seconds = seconds % divs[level];
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
};
