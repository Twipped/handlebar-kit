
import tap from 'tap';
import * as util from './util';

tap.test('flatten', (t) => {
	t.deepEqual(util.flatten([ 1, [ 2, 3 ], { a: 4, b: 5 } ]), [ 1, 2, 3, 4, 5 ]);
	t.end();
});


tap.test('reduce', (t) => {
	t.strictEqual(util.reduce([ 1, 2, 3 ], (a, b) => a + b, 0), 6, 'reduce array');
	t.strictEqual(util.reduce({ a: 1, b: 2, c: 3 }, (a, b) => a + b, 0), 6, 'reduce object');
	t.end();
});

tap.test('map', (t) => {
	t.deepEqual(
		util.map([
			{ foo: 1, bar: 0 },
			{ foo: 0, bar: 1 },
			{ foo: false, bar: 3 },
			{ foo: 2, bar: 0 },
			{ foo: -1, bar: 'a' },
		], 'foo'),
		[
			1,
			0,
			false,
			2,
			-1,
		],
	);
	t.end();
});
