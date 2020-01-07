
export function isNumber (input) { return typeof input === 'number' && !isNaN(input); }

export function isString (input) { return typeof input === 'string'; }

export function isFunction (input) { return typeof input === 'function'; }

export function isUndefined (input) { return typeof input === 'undefined'; }

export function isMap (input) { return input instanceof Map; }
export function isSet (input) { return input instanceof Set; }

export const isArray = Array.isArray;

export function isObject (input) {
	if (!input) return false;
	if (typeof input !== 'object') return false;
	if (isArray(input)) return false;
	if (!(input instanceof Object)) return false;
	if (input.constructor !== Object.prototype.constructor) return false;
	return true;
}

export function truthy (value) {
	if (isMappable(value)) return !!sizeOf(value);
	return !!value;
}

export function hasOwn (obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

export function ucfirst (input) {
	input = String(input);
	return input.charAt(0).toUpperCase() + input.slice(1);
}

export function ucsentence (input) {
	return input.replace(/((?:\S[^.?!]*)[.?!]*)/g, (txt) =>
		txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
	);
}

export function ucwords (input) {
	return input.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1));
}

export function merge (...sources) {
	const result = {};
	for (const source of sources) {
		if (!source) continue;
		for (const [ key, value ] of Object.entries(source)) {
			if (isObject(value)) {
				if (isObject(result[key])) {
					result[key] = merge(result[key], value);
				} else {
					result[key] = merge(value);
				}
			} else {
				result[key] = value;
			}
		}
	}
	return result;
}

export function get (obj, path, defaultValue) {
	if (typeof path === 'number') path = [ String(path) ];
	else if (isString(path)) path = String.prototype.split.call(path, /[,[\].]+?/);
	const result = path
		.filter((s) => s !== null && s !== undefined && s !== '')
		.reduce((res, key) => ((res !== null && res !== undefined) ? res[key] : res), obj);
	return (result === undefined || result === obj) ? defaultValue : result;
}

export function has (obj, path) {
	if (typeof path === 'number') path = [ String(path) ];
	else if (isString(path)) path = String.prototype.split.call(path, /[,[\].]+?/);
	let res = obj;
	for (const key of path) {
		if (res === null || res === undefined) return false;
		if (typeof res !== 'object' && typeof res !== 'function') return false;
		if (!hasOwn(res, key)) return false;
		res = res[key];
	}
	return true;
}

export function isMappable (collection, arrays = true) {
	return (
		(arrays && isArray(collection)) ||
		(arrays && isSet(collection)) ||
		isMap(collection) ||
		collection && (typeof collection === 'object' || typeof collection === 'function')
	);
}

export function sizeOf (collection) {
	if (isArray(collection) || isString(collection)) return collection.length;
	if (isSet(collection) || isMap(collection)) return collection.size;
	if (isObject(collection)) return Object.keys(collection).length;
	return !!collection;
}

export function keys (input) {
	if (isArray(input)) return [ ...input.keys() ];

	if (isSet(input)) return Array.from(input.entries(), ([ k ]) => k);

	if (isMap(input)) return Array.from(input.keys());

	if (isObject(input)) return Object.keys(input);

	return [];
}

export function values (input) {
	if (isArray(input)) return [ ...input ];

	if (isSet(input) || isMap(input)) return Array.from(input.values());

	if (isObject(input)) return Object.values(input);

	return [];
}

export function arrayify (input) {
	if (isArray(input)) return input;

	if (isSet(input) || isMap(input)) return Array.from(input.values());

	if (isObject(input)) return Object.values(input);

	return [ input ];
}

export function all (...args) {
	let input;
	if (args.length > 1) {
		input = args;
	} else {
		input = arrayify(args[0]);
	}

	let result = input.shift();
	for (const value of input) {
		if (!truthy(result)) {
			return false;
		}
		result = value;
	}

	return result;
}

export function iteratee (match) {
	if (isUndefined(match) || match === null) return Boolean;

	if (isFunction(match)) return match;

	if (isString(match)) {
		return (o) => {
			if (isArray(o)) return o.includes(match);
			if (isObject(o)) return o[match];
			if (isMap(o)) return o.get(match);
			if (isSet(o)) return o.has(match);
			if (isString(o)) return o === match;
			if (isNumber(o)) return String(o) === match;
			return o === match;
		};
	}

	if (isNumber(match)) {
		return (o) => {
			if (isObject(o) || isArray(o)) return o[match];
			if (isMap(o)) return o.get(match);
			if (isSet(o)) return o.has(match);
			if (isNumber(o)) return o === match;
			if (isString(o)) return Number(o) === match;
			return o === match;
		};
	}

	if (isArray(match)) {
		const [ key, value ] = match;
		return (o) => o[key] === value;
	}

	if (isObject(match)) {
		// create an array of key/value iteratees
		const tests = Object.entries(match).map(iteratee);
		// evaluate the object against the array
		return (o) => {
			for (const t of tests) {
				if (!t(o)) return false;
			}
			return true;
		};
	}
}

export function sorter (match) {

	if (isFunction(match)) return match;

	function qs (a, b) {
		if (a > b) return 1;
		else if (b > a) return -1;
		return 0;
	}

	if (isString(match)) {
		return (a, b) => {
			if (!isObject(a) && !isObject(b)) return qs(a, b);
			if (!isObject(a)) return -1;
			if (!isObject(b)) return 1;
			return qs(a[match], b[match]);
		};
	}

	if (isArray(match)) {
		return (a, b) => {
			if (!isObject(a) && !isObject(b)) return qs(a, b);
			if (!isObject(a)) return -1;
			if (!isObject(b)) return 1;
			for (const k of match) {
				const v = qs(a[k], b[k]);
				if (v) return v;
			}
			return 0;
		};
	}

	if (isObject(match)) {
		return (a, b) => {
			if (!isObject(a) && !isObject(b)) return qs(a, b);
			if (!isObject(a)) return -1;
			if (!isObject(b)) return 1;
			for (const [ k, d ] of Object.entries(match)) {
				const v = qs(a[k], b[k]) * (d < 0 ? -1 : 1);
				if (v) return v;
			}
			return 0;
		};
	}

	return (a, b) => {
		if (!isObject(a) && !isObject(b)) return qs(a, b);
		if (!isObject(a)) return -1;
		if (!isObject(b)) return 1;
		return 0;
	};
}

export function toPairs (object) {
	return Object.entries(object);
}

export function fromPairs (entries) {
	return mapReduce(entries, ([v, k]) => [ v, k ]);
}

export function slice (collection, begin, end) {
	if (isString(collection) || isArray(collection)) return collection.slice(begin, end);

	if (isSet(collection)) {
		return new Set(Array.from(collection.values()).slice(begin, end));
	}

	if (isMap(collection)) {
		return new Map(Array.from(collection.entries()).slice(begin, end));
	}

	if (isObject(collection)) {
		return fromPairs(toPairs(collection).slice(begin, end));
	}

	return collection;
}

export function sort (collection, predicate) {

	predicate = sorter(predicate);

	if (isArray(collection)) return [ ...collection ].sort(predicate);

	if (isSet(collection)) {
		return new Set(Array.from(collection.values()).sort(predicate));
	}

	// sort by key for maps and objects
	const hashpredicate = (a, b) => predicate(a[0], b[0]);

	if (isMap(collection)) {
		return new Map(Array.from(collection.entries()).sort(hashpredicate));
	}

	if (isObject(collection)) {
		return fromPairs(toPairs(collection).sort(hashpredicate));
	}

	return collection;
}

export function map (collection, predicate) {
	predicate = iteratee(predicate);

	if (isArray(collection)) {
		return collection.map((value, i) => predicate(value, i, i));
	}

	if (isSet(collection)) {
		return Array.from(collection, (value, i) => predicate(value, i, i));
	}

	return mapReduce(collection, (value, key, index) => [ key, predicate(value, key, index) ]);
}

export function filter (collection, predicate) {
	predicate = iteratee(predicate);

	if (isArray(collection)) {
		return collection.filter((value, i) => predicate(value, i, i));
	}

	if (isSet(collection)) {
		return Array.from(collection).filter((value, i) => predicate(value, i, i));
	}

	throw new Error('filter can not be applied to objects or maps, perhaps you meant to use omit?');
}

export function omit (collection, predicate) {
	if (isFunction(predicate)) {
		return mapReduce(collection, (value, key, index) =>
			(predicate(value, key, index)
				? [ undefined, undefined ]
				: [ key, value ]),
		);
	}

	if (isString(predicate)) {
		predicate = [ predicate ];
	}

	if (!isArray(predicate)) throw new Error('omit requires a string or array of strings');
	return mapReduce(collection, (value, key) =>
		(predicate.includes(key)
			? [ undefined, undefined ]
			: [ key, value ]),
	);
}

export function pick (collection, predicate) {
	if (typeof predicate === 'function') {
		return mapReduce(collection, (value, key, index) =>
			(predicate(value, key, index)
				? [ key, value ]
				: [ undefined, undefined ]),
		);
	}

	if (isString(predicate)) {
		predicate = [ predicate ];
	}

	if (!isArray(predicate)) throw new Error('pick requires a string or array of strings');
	return predicate.reduce((obj, key) => {
		if (collection && hasOwn(collection, key)) {
			obj[key] = collection[key];
		}
		return obj;
	}, {});
}

/**
 * Iterates over a collection and generates an object based on tuple returned from the iteratee.
 * @param  {Object|Array|Map|Set} collection
 * @param  {Function} iteratee Callback invoked for each item, receives `value, key, index`, returns `[key, value]`;
 * @return {Object}
 */
export function mapReduce (collection, cb) {
	if (!collection) return {};

	const result = {};
	function iterate (v, k, i) {
		// return true to continue looping
		const res = cb(v, k, i) || [];
		if (res === false) return false;
		if (!res) return true;
		const [ key, value ] = res;
		if (key === undefined || key === null || value === undefined) return true;
		result[key] = value;
		return true;
	}

	if (isArray(collection)) {
		let i = 0;
		for (const value of collection) {
			if (!iterate(value, i, i++)) break;
		}
		return result;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const item of collection) {
			if (!iterate(item, i, i++)) break;
		}
		return result;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (!iterate(value, key, i++)) break;
		}
		return result;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (!iterate(value, key, i++)) break;
		}
		return result;
	}

	return result;
}

export function reduce (collection, cb, init) {
	if (isArray(collection)) return collection.reduce(cb, init);

	if (isSet(collection)) {
		return Array.from(collection).reduce(cb, init);
	}

	if (isMap(collection)) {
		return Array.from(collection.entries()).reduce((prev, [ key, value ], i) => cb(prev, value, key, i), init);
	}

	if (isObject(collection)) {
		return Object.entries(collection).reduce((prev, [ key, value ], i) => cb(prev, value, key, i), init);
	}
}

export function flatten (collection, depth) {
	if (depth === undefined) depth = Infinity;
	if (depth <= 0) return slice(collection);
	return reduce(collection,
		(acc, val) => acc.concat(...(
			isMappable(val)
				? flatten(val, depth - 1)
				: [ val ]
		)),
		[],
	);
}
