
export default function timeHelper () {

	/**
	 * Convert a millisecond count into human readable time (minutes, hours, days)
	 * If the `short` parameter is truthy, then the function will use abbreviated duration units.
	 * By default the function returns the first major unit. If the `detailed` parameter is truthy,
	 * this will be extended to the smallest unit.
	 * @category strings
	 * @name time
	 *
	 * @signature {{time milliseconds [short=1] [detailed=1]}}
	 * @param  {number} milliseconds [description]
	 * @param  {boolean} short [description]
	 * @return {string}
	 */
	return function time (...args) {
		const options = args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "time" needs 1 parameter');
		}

		let [ milliseconds ] = args;

		var keysL = [ 'Year',      'Month',    'Week',    'Day',    'Hour',    'Minute',    'Second', 'Millisecond' ];
		var keysS = [ 'yr',        'mo',       'wk',      'd',      'h',       'm',         's',      'ms' ];
		var divs  = [ 31536000000, 2592000000, 604800000, 86400000, 3600000,   60000,       1000,     1 ];
		var stack = [];
		var level = 0;
		var value;

		const short = args[1] || options.hash && options.hash.short;
		const detailed = options.hash && options.hash.detailed;
		const keys = short ? keysS : keysL;

		milliseconds = Math.abs(milliseconds);

		while (milliseconds) {
			value = Math.floor(milliseconds / divs[level]);
			milliseconds = milliseconds % divs[level];
			if (value) {
				let pushable = [ value, keys[level] ].join(short ? '' : ' ');
				if (!short && value > 1) pushable += 's';
				stack.push(pushable);
				if (!detailed) break;
			}
			level++;
		}

		return stack.join(' ');

	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{time a}}',
			input: { a: 5 },
			output: '5 Milliseconds',
		},
		{
			template: '{{time a}}',
			input: { a: 1000 },
			output: '1 Second',
		},
		{
			template: '{{time a}}',
			input: { a: 2000 },
			output: '2 Seconds',
		},
		{
			template: '{{time a}}',
			input: { a: 60000 },
			output: '1 Minute',
		},
		{
			template: '{{time a}}',
			input: { a: 60 * 65 * 1000 },
			output: '1 Hour',
		},
		{
			template: '{{seconds a true}}',
			input: { a: 60 * 65 },
			output: '1h',
		},
		{
			template: '{{seconds a detailed=true}}',
			input: { a: 60 * 65 },
			output: '1 Hour 5 Minutes',
		},
		{
			template: '{{time a}}',
			input: { a: 60 * 60 * 24 * 1000 },
			output: '1 Day',
		},
		{
			template: '{{time a}}',
			input: { a: 60 * 60 * 24 * 7 * 1000 },
			output: '1 Week',
		},
		{
			template: '{{time a}}',
			input: { a: 60 * 60 * 24 * 30 * 1000 },
			output: '1 Month',
		},
		{
			template: '{{time a}}',
			input: { a: 60 * 60 * 24 * 365 * 1000 },
			output: '1 Year',
		},
		{
			template: '{{time a}}',
			input: { a: 60 * 60 * 24 * 365 * 100 * 1000 },
			output: '100 Years',
		},
	);
}
