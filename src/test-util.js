
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
