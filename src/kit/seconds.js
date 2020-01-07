
export default function secondsHelper () {

	/**
	 * Convert a second count into human readable time (minutes, hours, days)
	 * If the `short` parameter is truthy, then the function will use abbreviated duration units.
	 * By default the function returns the first major unit. If the `detailed` parameter is truthy,
	 * this will be extended to the smallest unit.
	 * @category strings
	 * @name seconds
	 *
	 * @signature {{seconds seconds [short=1] [detailed=1]}}
	 * @param  {number} seconds [description]
	 * @param  {boolean} short [description]
	 * @return {string}
	 */
	return function seconds (...args) {
		const options = args.pop();

		if (!args.length) {
			throw new Error('Handlebars Helper "seconds" needs at least 1 parameter');
		}

		let [ secs ] = args;

		var keysL = [ 'Year',      'Month',    'Week',    'Day',    'Hour',    'Minute',   'Second' ];
		var keysS = [ 'yr',        'mo',       'wk',      'd',      'h',       'm',        's' ];
		var divs  = [ 31536000,    2592000,    604800,    86400,    3600,      60,         1 ];
		var stack = [];
		var level = 0;
		var value;

		const short = args[1] || options.hash && options.hash.short;
		const detailed = options.hash && options.hash.detailed;
		const keys = short ? keysS : keysL;

		secs = Math.abs(secs);

		while (secs) {
			value = Math.floor(secs / divs[level]);
			secs = secs % divs[level];
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
			template: '{{seconds a}}',
			input: { a: 1 },
			output: '1 Second',
		},
		{
			template: '{{seconds a}}',
			input: { a: 2 },
			output: '2 Seconds',
		},
		{
			template: '{{seconds a}}',
			input: { a: 60 },
			output: '1 Minute',
		},
		{
			template: '{{seconds a}}',
			input: { a: 60 * 65 },
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
			template: '{{seconds a}}',
			input: { a: 60 * 60 * 24 },
			output: '1 Day',
		},
		{
			template: '{{seconds a}}',
			input: { a: 60 * 60 * 24 * 7 },
			output: '1 Week',
		},
		{
			template: '{{seconds a}}',
			input: { a: 60 * 60 * 24 * 30 },
			output: '1 Month',
		},
		{
			template: '{{seconds a}}',
			input: { a: 60 * 60 * 24 * 365 },
			output: '1 Year',
		},
		{
			template: '{{seconds a}}',
			input: { a: 60 * 60 * 24 * 365 * 100 },
			output: '100 Years',
		},
	);
}
