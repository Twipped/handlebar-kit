
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

tap.test('uniq', (t) => {
	t.deepEqual(util.uniq([ 1, 2, 3, 2, 2, 1 ]), [ 1, 2, 3 ], 'uniq an array');
	t.deepEqual(util.uniq([ 2.1, 1.2, 2.3 ], Math.floor), [ 2.1, 1.2 ], 'uniq with a predicate on primitives');
	t.deepEqual(util.uniq([ { 'x': 1 }, { 'x': 2 }, { 'x': 1 } ], 'x'), [ { 'x': 1 }, { 'x': 2 } ], 'uniq with a predicate on objects');
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

tap.test('set', (t) => {
	t.deepEqual(util.set({ 'a': { 'b': 1 } }, 'a.b', 2), { 'a': { 'b': 2 } }, 'overwrite value');
	t.deepEqual(util.set({ 'a': { 'b': 1 } }, [ 'a', 'b' ], 2), { 'a': { 'b': 2 } }, 'overwrite value 2');
	t.deepEqual(util.set({ 'a': null }, 'a.b', 2), { 'a': { 'b': 2 } }, 'overwrite shallow value');
	t.deepEqual(util.set({}, 'a.b', 2), { 'a': { 'b': 2 } }, 'write to empty');
	t.end();
});

tap.test('pick', (t) => {
	const source = { a: { b: 1, c: 2, d: { e: 3 } }, e: 4, f: 5 };
	t.deepEqual(
		util.pick(source, 'a.b'),
		{ 'a': { 'b': 1 } },
		'single item pick',
	);
	t.deepEqual(
		util.pick(source, [ 'e', 'f' ]),
		{ e: 4, f: 5 },
		'multi item pick',
	);

	t.end();
});

tap.test('deepPick', (s) => {
	s.test('picks a and b from array of objects with a, b, c properties', (t) => {
		const input = [
			{ a: 1, b: 2, c: 3 },
			{ a: 4, b: 5, c: 6 },
			{ a: 7, b: 8, c: 9 },
		];
		const schema = [ { a: 1, b: 1 } ];
		const output = [ { a: 1, b: 2 }, { a: 4, b: 5 }, { a: 7, b: 8 } ];
		t.deepEqual(util.deepPick(input, schema), output);

		t.end();
	});

	s.test('picks a and nested c and e properties in b', (t) => {
		const input = { a: 1, b: { c: 2, d: 3, e: 4 } };
		const schema = { a: true, b: { c: true, e: true } };
		const output = { a: 1, b: { c: 2, e: 4 } };

		t.deepEqual(util.deepPick(input, schema), output);

		t.end();
	});

	s.test('picks properties from nested objects and arrays', (t) => {
		const input = {
			name: 'John Doe',
			age: 35,
			hobby: 'cars',
			family: {
				wife: { name: 'Susan', age: 32, hobby: 'baseball' },
				children: [
					{ name: 'Alex', age: 5, hobby: 'dancing' },
					{ name: 'Alice', age: 3, hobby: 'music' },
				],
			},
			cars: [
				{ model: 'BMW X5', year: 2015 },
				{ model: 'Tesla Model S', year: 2018 },
			],
		};

		const schema = {
			name: true,
			age: true,
			family: {
				wife: { name: true, age: true },
				children: [ {
					name: true,
					age: true,
				} ],
			},
			cars: [ {
				model: true,
			} ],
		};

		const output = {
			name: 'John Doe',
			age: 35,
			family: {
				wife: { name: 'Susan', age: 32 },
				children: [ { name: 'Alex', age: 5 }, { name: 'Alice', age: 3 } ],
			},
			cars: [ { model: 'BMW X5' }, { model: 'Tesla Model S' } ],
		};

		t.deepEqual(util.deepPick(input, schema), output);

		t.end();
	});

	s.end();
});

tap.test('pathinate', (t) => {
	t.deepEqual(
		util.pathinate({ a: { b: 1, c: 2, d: { e: 3 } }, e: 4, f: 5 }),
		[
			'a.b',
			'a.c',
			'a.d.e',
			'e',
			'f',
		],
	);
	// t.deepEqual(
	// 	util.pathinate({ a: [ { b: 1 }, { b: 2 } ], c: [ [ 0 ] ] }),
	// 	[
	// 		'a[*].b',
	// 		'c[*][*]',
	// 	],
	// );

	t.end();
});

tap.test('groupBy', (s) => {
	s.deepEqual(
		util.groupBy([ 'one', 'two', 'three' ], 'length'),
		{ '3': [ 'one', 'two' ], '5': [ 'three' ] },
	);

	s.test('number for iteratee on multi-index arrays', (t) => {
		var array = [
			[ 1, 'a' ],
			[ 2, 'a' ],
			[ 2, 'b' ],
		];

		t.deepEqual(util.groupBy(array, 0), { '1': [ [ 1, 'a' ] ], '2': [ [ 2, 'a' ], [ 2, 'b' ] ] });
		t.deepEqual(util.groupBy(array, 1), { 'a': [ [ 1, 'a' ], [ 2, 'a' ] ], 'b': [ [ 2, 'b' ] ] });

		t.end();
	});

	s.test('should work with an object for `collection`', (t) => {
		const actual = util.groupBy({ 'a': 6.1, 'b': 4.2, 'c': 6.3 }, Math.floor);
		t.deepEqual(actual, { '4': [ 4.2 ], '6': [ 6.1, 6.3 ] });

		t.end();
	});

	s.end();
});

tap.test('keyBy', (s) => {


	s.test('should transform keys by `iteratee`', (t) => {
		const array = [
			{ 'dir': 'left', 'code': 97 },
			{ 'dir': 'right', 'code': 100 },
		];

		t.deepEqual(
			util.keyBy(array, (object) => String.fromCharCode(object.code)),
			{ 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } },
		);

		t.end();
	});

	s.test('should transform keys by `iteratee`', (t) => {
		const array = [
			{ 'dir': 'left', 'code': 97 },
			{ 'dir': 'right', 'code': 100 },
		];

		t.deepEqual(
			util.keyBy(array, 'dir'),
			{ 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } },
		);

		t.end();
	});

	s.test('number for iteratee on multi-index arrays', (t) => {
		var array = [
			[ 1, 'a' ],
			[ 2, 'a' ],
			[ 2, 'b' ],
		];

		t.deepEqual(util.keyBy(array, 0), { '1': [ 1, 'a' ], '2': [ 2, 'b' ] });
		t.deepEqual(util.keyBy(array, 1), { 'a': [ 2, 'a' ], 'b': [ 2, 'b' ] });

		t.end();
	});

	s.end();
});

