
export function isNumber    (input) { return typeof input === 'number' && !isNaN(input); }
export function isString    (input) { return typeof input === 'string'; }
export function isBoolean   (input) { return typeof input === 'boolean'; }
export function isFunction  (input) { return typeof input === 'function'; }
export function isUndefined (input) { return typeof input === 'undefined'; }
export function isMap       (input) { return input instanceof Map; }
export function isSet       (input) { return input instanceof Set; }

export function isPrimitive (input) {
	switch (typeof input) {
	case 'string':
	case 'number':
	case 'boolean':
		return true;
	default:
		return false;
	}
}

export function isNull (input) { return input === null; }

export function isObject (input) {
	if (!input) return false;
	if (typeof input !== 'object') return false;
	if (isArray(input)) return false;
	if (!(input instanceof Object)) return false;
	if (input.constructor !== Object.prototype.constructor) return false;
	return true;
}

export const isArray = Array.isArray;
export function isArrayOfStrings    (input) { return allBy(input, isString); }
export function isArrayOfNumbers    (input) { return allBy(input, isNumber); }
export function isArrayOfBooleans   (input) { return allBy(input, isBoolean); }
export function isArrayOfObjects    (input) { return allBy(input, isObject); }
export function isArrayOfMappables  (input) { return allBy(input, isMappable); }
export function isArrayOfPrimatives (input) { return allBy(input, isPrimitive); }

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

export function set (obj, path, value) {
	if (path === null && path === undefined && path === '') return false;
	if (isNumber(path)) path = [ String(path) ];
	else if (isString(path)) {
		if (hasOwn(obj, path)) {
			obj[path] = value;
			return obj;
		}
		path = path.split(/[,[\].]+?/);
	}

	const c = path.length - 1;
	path
		.filter((s) => s || s === 0)
		.reduce((res, key, i) => {
			if (i === c) {
				res[key] = value;
				return true;
			}
			if (isObject(res[key]) || isFunction(res[key])) return res[key];
			return (res[key] = {});
		}, obj);

	return obj;
}

export function get (obj, path, defaultValue) {
	if (path === null && path === undefined && path === '') return defaultValue;
	if (isNumber(path)) path = [ String(path) ];
	else if (isString(path)) {
		if (hasOwn(obj, path)) return obj[path];
		path = path.split(/[,[\].]+?/);
	}

	const result = path
		.filter((s) => s !== null && s !== undefined && s !== '')
		.reduce((res, key) =>
			((res !== null && res !== undefined) ? res[key] : res)
		, obj);
	return (result === undefined || result === obj) ? defaultValue : result;
}

export function has (obj, path) {
	if (isNumber(path)) path = [ String(path) ];
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

export function allBy (collection, predicate = null) {
	if (!collection) return false;
	if (predicate === null) {
		predicate = (v) => v;
	} else {
		predicate = iteratee(predicate);
	}

	if (isArray(collection)) {
		let i = 0;
		for (const value of collection) {
			if (!predicate(value, i, i++)) return false;
		}
		return true;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const item of collection) {
			if (!predicate(item, i, i++)) return false;
		}
		return true;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (!predicate(value, key, i++)) return false;
		}
		return true;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (!predicate(value, key, i++)) return false;
		}
		return true;
	}

	return !!collection;
}

export function any (...args) {
	let input;
	if (args.length > 1) {
		input = args;
	} else {
		input = arrayify(args[0]);
	}

	for (const value of input) {
		if (truthy(value)) {
			return value;
		}
	}

	return input[input.length - 1];
}

export function anyBy (collection, predicate = null) {
	if (!collection) return false;
	if (predicate === null) {
		predicate = (v) => v;
	} else {
		predicate = iteratee(predicate);
	}

	if (isArray(collection)) {
		let i = 0;
		for (const value of collection) {
			if (predicate(value, i, i++)) return true;
		}
		return false;
	}

	if (isSet(collection)) {
		let i = 0;
		for (const item of collection) {
			if (predicate(item, i, i++)) return true;
		}
		return false;
	}

	// received a Map
	if (isMap(collection)) {
		let i = 0;
		for (const [ key, value ] of collection.entries()) {
			if (predicate(value, key, i++)) return true;
		}
		return false;
	}

	// received an object hash
	if (isObject(collection)) {
		let i = 0;
		for (const [ key, value ] of Object.entries(collection)) {
			if (predicate(value, key, i++)) return true;
		}
		return false;
	}

	return !!collection;
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
			if (isPrimitive(o)) return o[match];
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
	return mapReduce(entries, ([ v, k ]) => [ v, k ]);
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

export function uniq (collection, predicate = null) {
	if (predicate === null) {
		predicate = (v) => v;
	} else {
		predicate = iteratee(predicate);
	}

	const exists = new Set();

	if (isArray(collection)) {
		const result = [];
		collection.forEach((v) => {
			const match = predicate(v);
			if (exists.has(match)) return;
			exists.add(match);
			result.push(v);
		});

		return result;
	}

	if (isSet(collection)) return new Set(collection); // really?

	if (isMap(collection)) {
		return new Map(Array.from(collection.entries(), ([ k, v ]) => {
			const match = predicate(v);
			if (exists.has(match)) return false;
			exists.add(match);
			return [ k, v ];
		}).filter(Boolean));
	}

	if (isObject(collection)) {
		return mapReduce(collection, ([ v, k ]) => {
			const match = predicate(v);
			if (exists.has(match)) return null;
			exists.add(match);
			return [ k, v ];
		});
	}

	return collection;
}

export function keyBy (collection, predicate) {
	predicate = iteratee(predicate);
	return mapReduce(collection, (value, key, index) =>
		[ predicate(value, key, index), value ],
	);
}

export function groupBy (collection, predicate) {
	predicate = iteratee(predicate);
	return reduce(collection, (result, value, key, index) => {
		const k = predicate(value, key, index);
		(result[k] || (result[k] = [])).push(value);
		return result;
	}, {});
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
	if (!collection) return {};

	if (isFunction(predicate)) {
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
		const value = get(collection, key);
		if (isUndefined(value)) return obj;
		return set(obj, key, value);
	}, {});
}


export function deepPick (collection, schema) {
	if (isPrimitive(schema) && isPrimitive(collection)) return collection;

	if (isArray(schema) && schema.length > 0) {
		// collection does not match this schema tier, abort
		if (!isArray(collection)) return;

		schema = schema[0];
		return collection.map((branch) => deepPick(branch, schema));
	}

	// if the schema at this tier is not an object,
	// return the value at this tier only if schema is truthy
	if (!isObject(schema)) return schema ? collection : undefined;
	if (isPrimitive(collection)) return;

	// if the collection isn't something we can pull data from, skip it
	if (!isObject(collection) && !isFunction(collection)) return;

	const result = {};
	for (const [ key, subschema ] of Object.entries(schema)) {

		const target = collection[key];
		if (isUndefined(target)) continue;

		const child = deepPick(target, subschema);
		if (isUndefined(child)) continue;

		result[key] = child;
	}

	return result;
}



export function pathinate (object, delimiter = '.') {
	const paths = [];

	function descend (branch, ancest) {
		if (!isObject(branch)) {
			paths.push(ancest.join(delimiter));
			return;
		}
		for (const [ k, v ] of Object.entries(branch)) {
			descend(v, ancest.concat([ k ]));
		}
		return;
	}

	descend(object, []);

	return uniq(paths);
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
		if (!res || !isArray(res)) return true;
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

export function reduce (collection, predicate, init) {
	if (!isFunction(predicate)) throw new TypeError('Predicate must be a function');

	if (isArray(collection)) return collection.reduce((r, v, i) => predicate(r, v, i, i), init);

	if (isSet(collection)) {
		return Array.from(collection).reduce((r, v, i) => predicate(r, v, i, i), init);
	}

	if (isMap(collection)) {
		return Array.from(collection.entries()).reduce((prev, [ key, value ], i) => predicate(prev, value, key, i), init);
	}

	if (isObject(collection)) {
		return Object.entries(collection).reduce((prev, [ key, value ], i) => predicate(prev, value, key, i), init);
	}
}

export function flatten (collection, depth = Infinity) {
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

export function slugify (input, delimiter = '-', separators = false) {
	var i = separators && separators.length;
	var slug = input;
	var regexEscape = new RegExp(/[[/\\^$*+?.()|{}\]]/g);
	var regexDelimiter = delimiter.replace(regexEscape, '\\$&');
	var prohibited = new RegExp('([^a-z0-9' + regexDelimiter + '])', 'g');
	var consecutive = new RegExp('(' + regexDelimiter + '+)', 'g');
	var trim = new RegExp('^' + regexDelimiter + '*(.*?)' + regexDelimiter + '*$');
	var sanitizer = {
		// common latin
		'á': 'a',
		'à': 'a',
		'â': 'a',
		'ä': 'a',
		'ã': 'a',
		'æ': 'ae',
		'ç': 'c',
		'é': 'e',
		'è': 'e',
		'ê': 'e',
		'ë': 'e',
		'ẽ': 'e',
		'í': 'i',
		'ì': 'i',
		'î': 'i',
		'ï': 'i',
		'ĩ': 'i',
		'ó': 'o',
		'ò': 'o',
		'ô': 'o',
		'ö': 'o',
		'õ': 'o',
		'œ': 'oe',
		'ß': 'ss',
		'ú': 'u',
		'ù': 'u',
		'û': 'u',
		'ü': 'u',
		'ũ': 'u',

		// other diacritics
		'ă': 'a',
		'ắ': 'a',
		'ằ': 'a',
		'ẵ': 'a',
		'ẳ': 'a',
		'ấ': 'a',
		'ầ': 'a',
		'ẫ': 'a',
		'ẩ': 'a',
		'ǎ': 'a',
		'å': 'a',
		'ǻ': 'a',
		'ǟ': 'a',
		'ȧ': 'a',
		'ǡ': 'a',
		'ą': 'a',
		'ā': 'a',
		'ả': 'a',
		'ȁ': 'a',
		'ȃ': 'a',
		'ạ': 'a',
		'ặ': 'a',
		'ậ': 'a',
		'ḁ': 'a',
		'ⱥ': 'a',
		'ᶏ': 'a',
		'ɐ': 'a',
		'ɑ': 'a',

		'ḃ': 'b',
		'ḅ': 'b',
		'ḇ': 'b',
		'ƀ': 'b',
		'ɓ': 'b',
		'ƃ': 'b',
		'ᵬ': 'b',
		'ᶀ': 'b',
		'þ': 'b',

		'ć': 'c',
		'ĉ': 'c',
		'č': 'c',
		'ċ': 'c',
		'ḉ': 'c',
		'ȼ': 'c',
		'ƈ': 'c',
		'ɕ': 'c',

		'ď': 'd',
		'ḋ': 'd',
		'ḑ': 'd',
		'ḍ': 'd',
		'ḓ': 'd',
		'ḏ': 'd',
		'đ': 'd',
		'ɖ': 'd',
		'ɗ': 'd',
		'ƌ': 'd',
		'ᵭ': 'd',
		'ᶁ': 'd',
		'ᶑ': 'd',
		'ȡ': 'd',
		'∂': 'd',

		'ĕ': 'e',
		'ế': 'e',
		'ề': 'e',
		'ễ': 'e',
		'ể': 'e',
		'ě': 'e',
		'ė': 'e',
		'ȩ': 'e',
		'ḝ': 'e',
		'ę': 'e',
		'ē': 'e',
		'ḗ': 'e',
		'ḕ': 'e',
		'ẻ': 'e',
		'ȅ': 'e',
		'ȇ': 'e',
		'ẹ': 'e',
		'ệ': 'e',
		'ḙ': 'e',
		'ḛ': 'e',
		'ɇ': 'e',
		'ᶒ': 'e',

		'ḟ': 'f',
		'ƒ': 'f',
		'ᵮ': 'f',
		'ᶂ': 'f',

		'ǵ': 'g',
		'ğ': 'g',
		'ĝ': 'g',
		'ǧ': 'g',
		'ġ': 'g',
		'ģ': 'g',
		'ḡ': 'g',
		'ǥ': 'g',
		'ɠ': 'g',
		'ᶃ': 'g',

		'ĥ': 'h',
		'ȟ': 'h',
		'ḧ': 'h',
		'ḣ': 'h',
		'ḩ': 'h',
		'ḥ': 'h',
		'ḫ': 'h',
		'ẖ': 'h',
		'ħ': 'h',
		'ⱨ': 'h',

		'ĭ': 'i',
		'ǐ': 'i',
		'ḯ': 'i',
		'į': 'i',
		'ī': 'i',
		'ỉ': 'i',
		'ȉ': 'i',
		'ȋ': 'i',
		'ị': 'i',
		'ḭ': 'i',
		'ɨ': 'i',
		'ᵻ': 'i',
		'ᶖ': 'i',
		'i': 'i',
		'ı': 'i',

		'ĵ': 'j',
		'ɉ': 'j',
		'ǰ': 'j',
		'ȷ': 'j',
		'ʝ': 'j',
		'ɟ': 'j',
		'ʄ': 'j',

		'ḱ': 'k',
		'ǩ': 'k',
		'ķ': 'k',
		'ḳ': 'k',
		'ḵ': 'k',
		'ƙ': 'k',
		'ⱪ': 'k',
		'ᶄ': 'k',

		'ĺ': 'l',
		'ľ': 'l',
		'ļ': 'l',
		'ḷ': 'l',
		'ḹ': 'l',
		'ḽ': 'l',
		'ḻ': 'l',
		'ł': 'l',
		'ŀ': 'l',
		'ƚ': 'l',
		'ⱡ': 'l',
		'ɫ': 'l',
		'ɬ': 'l',
		'ᶅ': 'l',
		'ɭ': 'l',
		'ȴ': 'l',

		'ḿ': 'm',
		'ṁ': 'm',
		'ṃ': 'm',
		'ᵯ': 'm',
		'ᶆ': 'm',
		'ɱ': 'm',

		'ń': 'n',
		'ǹ': 'n',
		'ň': 'n',
		'ñ': 'n',
		'ṅ': 'n',
		'ņ': 'n',
		'ṇ': 'n',
		'ṋ': 'n',
		'ṉ': 'n',
		'n̈': 'n',
		'ɲ': 'n',
		'ƞ': 'n',
		'ŋ': 'n',
		'ᵰ': 'n',
		'ᶇ': 'n',
		'ɳ': 'n',
		'ȵ': 'n',

		'ŏ': 'o',
		'ố': 'o',
		'ồ': 'o',
		'ỗ': 'o',
		'ổ': 'o',
		'ǒ': 'o',
		'ȫ': 'o',
		'ő': 'o',
		'ṍ': 'o',
		'ṏ': 'o',
		'ȭ': 'o',
		'ȯ': 'o',
		'͘o͘': 'o',
		'ȱ': 'o',
		'ø': 'o',
		'ǿ': 'o',
		'ǫ': 'o',
		'ǭ': 'o',
		'ō': 'o',
		'ṓ': 'o',
		'ṑ': 'o',
		'ỏ': 'o',
		'ȍ': 'o',
		'ȏ': 'o',
		'ơ': 'o',
		'ớ': 'o',
		'ờ': 'o',
		'ỡ': 'o',
		'ở': 'o',
		'ợ': 'o',
		'ọ': 'o',
		'ộ': 'o',
		'ɵ': 'o',
		'ɔ': 'o',

		'ṕ': 'p',
		'ṗ': 'p',
		'ᵽ': 'p',
		'ƥ': 'p',
		'p̃': 'p',
		'ᵱ': 'p',
		'ᶈ': 'p',

		'ɋ': 'q',
		'ƣ': 'q',
		'ʠ': 'q',

		'ŕ': 'r',
		'ř': 'r',
		'ṙ': 'r',
		'ŗ': 'r',
		'ȑ': 'r',
		'ȓ': 'r',
		'ṛ': 'r',
		'ṝ': 'r',
		'ṟ': 'r',
		'ɍ': 'r',
		'ɽ': 'r',
		'ᵲ': 'r',
		'ᶉ': 'r',
		'ɼ': 'r',
		'ɾ': 'r',
		'ᵳ': 'r',

		'ś': 's',
		'ṥ': 's',
		'ŝ': 's',
		'š': 's',
		'ṧ': 's',
		'ṡẛ': 's',
		'ş': 's',
		'ṣ': 's',
		'ṩ': 's',
		'ș': 's',
		's̩': 's',
		'ᵴ': 's',
		'ᶊ': 's',
		'ʂ': 's',
		'ȿ': 's',

		'ť': 't',
		'ṫ': 't',
		'ţ': 't',
		'ṭ': 't',
		'ț': 't',
		'ṱ': 't',
		'ṯ': 't',
		'ŧ': 't',
		'ⱦ': 't',
		'ƭ': 't',
		'ʈ': 't',
		'̈ẗ': 't',
		'ᵵ': 't',
		'ƫ': 't',
		'ȶ': 't',

		'ŭ': 'u',
		'ǔ': 'u',
		'ů': 'u',
		'ǘ': 'u',
		'ǜ': 'u',
		'ǚ': 'u',
		'ǖ': 'u',
		'ű': 'u',
		'ṹ': 'u',
		'ų': 'u',
		'ū': 'u',
		'ṻ': 'u',
		'ủ': 'u',
		'ȕ': 'u',
		'ȗ': 'u',
		'ư': 'u',
		'ứ': 'u',
		'ừ': 'u',
		'ữ': 'u',
		'ử': 'u',
		'ự': 'u',
		'ụ': 'u',
		'ṳ': 'u',
		'ṷ': 'u',
		'ṵ': 'u',
		'ʉ': 'u',
		'ᵾ': 'u',
		'ᶙ': 'u',

		'ṽ': 'v',
		'ṿ': 'v',
		'ʋ': 'v',
		'ᶌ': 'v',
		'ⱴ': 'v',

		'ẃ': 'w',
		'ẁ': 'w',
		'ŵ': 'w',
		'ẅ': 'w',
		'ẇ': 'w',
		'ẉ': 'w',
		'ẘ': 'w',

		'ẍ': 'x',
		'ẋ': 'x',
		'ᶍ': 'x',

		'ý': 'y',
		'ỳ': 'y',
		'ŷ': 'y',
		'ẙ': 'y',
		'ÿ': 'y',
		'ỹ': 'y',
		'ẏ': 'y',
		'ȳ': 'y',
		'ỷ': 'y',
		'ỵ': 'y',
		'ɏ': 'y',
		'ƴ': 'y',
		'ʏ': 'y',

		'ź': 'z',
		'ẑ': 'z',
		'ž': 'z',
		'ż': 'z',
		'ẓ': 'z',
		'ẕ': 'z',
		'ƶ': 'z',
		'ȥ': 'z',
		'ⱬ': 'z',
		'ᵶ': 'z',
		'ᶎ': 'z',
		'ʐ': 'z',
		'ʑ': 'z',
		'ɀ': 'z',

		// greek
		'α': 'a',
		'β': 'b',
		'γ': 'g',
		'ɣ': 'g',
		'δ': 'd',
		'ð': 'd',
		'ε': 'e',
		'ζ': 'z',
		'η': 'i',
		'θ': 'th',
		'ι': 'i',
		'κ': 'k',
		'λ': 'l',
		'μ': 'm',
		'µ': 'm',
		'ν': 'n',
		'ξ': 'x',
		'ο': 'o',
		'π': 'p',
		'ρ': 'r',
		'σ': 's',
		'ς': 's',
		'τ': 't',
		'υ': 'u', // official rule: if preceeded by 'α' OR 'ε' => 'v', by 'ο' => 'u', else => 'i'
		'φ': 'f',
		'χ': 'ch',
		'ψ': 'ps',
		'ω': 'o',

		// greek diacritics
		'ᾳ': 'a',
		'ά': 'a',
		'ὰ': 'a',
		'ᾴ': 'a',
		'ᾲ': 'a',
		'ᾶ': 'a',
		'ᾷ': 'a',
		'ἀ': 'a',
		'ᾀ': 'a',
		'ἄ': 'a',
		'ᾄ': 'a',
		'ἂ': 'a',
		'ᾂ': 'a',
		'ἆ': 'a',
		'ᾆ': 'a',
		'ἁ': 'a',
		'ᾁ': 'a',
		'ἅ': 'a',
		'ᾅ': 'a',
		'ἃ': 'a',
		'ᾃ': 'a',
		'ἇ': 'a',
		'ᾇ': 'a',
		'ᾱ': 'a',
		'ᾰ': 'a',

		'έ': 'e',
		'ὲ': 'e',
		'ἐ': 'e',
		'ἔ': 'e',
		'ἒ': 'e',
		'ἑ': 'e',
		'ἕ': 'e',
		'ἓ': 'e',

		'ῃ': 'i',
		'ή': 'i',
		'ὴ': 'i',
		'ῄ': 'i',
		'ῂ': 'i',
		'ῆ': 'i',
		'ῇ': 'i',
		'ἠ': 'i',
		'ᾐ': 'i',
		'ἤ': 'i',
		'ᾔ': 'i',
		'ἢ': 'i',
		'ᾒ': 'i',
		'ἦ': 'i',
		'ᾖ': 'i',
		'ἡ': 'i',
		'ᾑ': 'i',
		'ἥ': 'i',
		'ᾕ': 'i',
		'ἣ': 'i',
		'ᾓ': 'i',
		'ἧ': 'i',
		'ᾗ': 'i',

		'ί': 'i',
		'ὶ': 'i',
		'ῖ': 'i',
		'ἰ': 'i',
		'ἴ': 'i',
		'ἲ': 'i',
		'ἶ': 'i',
		'ἱ': 'i',
		'ἵ': 'i',
		'ἳ': 'i',
		'ἷ': 'i',
		'ϊ': 'i',
		'ΐ': 'i',
		'ῒ': 'i',
		'ῗ': 'i',
		'ῑ': 'i',
		'ῐ': 'i',

		'ό': 'o',
		'ὸ': 'o',
		'ὀ': 'o',
		'ὄ': 'o',
		'ὂ': 'o',
		'ὁ': 'o',
		'ὅ': 'o',
		'ὃ': 'o',

		'ύ': 'u',
		'ὺ': 'u',
		'ῦ': 'u',
		'ὐ': 'u',
		'ὔ': 'u',
		'ὒ': 'u',
		'ὖ': 'u',
		'ὑ': 'u',
		'ὕ': 'u',
		'ὓ': 'u',
		'ὗ': 'u',
		'ϋ': 'u',
		'ΰ': 'u',
		'ῢ': 'u',
		'ῧ': 'u',
		'ῡ': 'u',
		'ῠ': 'u',

		'ῳ': 'o',
		'ώ': 'o',
		'ῴ': 'o',
		'ὼ': 'o',
		'ῲ': 'o',
		'ῶ': 'o',
		'ῷ': 'o',
		'ὠ': 'o',
		'ᾠ': 'o',
		'ὤ': 'o',
		'ᾤ': 'o',
		'ὢ': 'o',
		'ᾢ': 'o',
		'ὦ': 'o',
		'ᾦ': 'o',
		'ὡ': 'o',
		'ᾡ': 'o',
		'ὥ': 'o',
		'ᾥ': 'o',
		'ὣ': 'o',
		'ᾣ': 'o',
		'ὧ': 'o',
		'ᾧ': 'o',

		'ῤ': 'r',
		'ῥ': 'r',

		// cyrillic (russian)
		'а': 'a',
		'б': 'b',
		'в': 'v',
		'г': 'g',
		'д': 'd',
		'е': 'e',
		'ё': 'e',
		'ж': 'zh',
		'з': 'z',
		'и': 'i',
		'й': 'j',
		'к': 'k',
		'л': 'l',
		'м': 'm',
		'н': 'n',
		'о': 'o',
		'п': 'p',
		'р': 'r',
		'с': 's',
		'т': 't',
		'у': 'u',
		'ф': 'f',
		'х': 'h',
		'ц': 'ts',
		'ч': 'ch',
		'ш': 'sh',
		'щ': 'sh',
		'ъ': '',
		'ы': 'i',
		'ь': '',
		'э': 'e',
		'ю': 'yu',
		'я': 'ya',
		// ---
		'і': 'j',
		'ѳ': 'f',
		'ѣ': 'e',
		'ѵ': 'i',
		'ѕ': 'z',
		'ѯ': 'ks',
		'ѱ': 'ps',
		'ѡ': 'o',
		'ѫ': 'yu',
		'ѧ': 'ya',
		'ѭ': 'yu',
		'ѩ': 'ya',

		// currency
		'₳': 'ARA',
		'฿': 'THB',
		'₵': 'GHS',
		'¢': 'c',
		'₡': 'CRC',
		'₢': 'Cr',
		'₠': 'XEU',
		'$': 'USD',
		'₫': 'VND',
		'৳': 'BDT',
		'₯': 'GRD',
		'€': 'EUR',
		'₣': 'FRF',
		'₲': 'PYG',
		'₴': 'HRN',
		'₭': 'LAK',
		'₦': 'NGN',
		'₧': 'ESP',
		'₱': 'PhP',
		'£': 'GBP',
		'₤': 'GBP',
		'₨': 'Rs',
		'₪': 'NS',
		'₮': 'MNT',
		'₩': 'WON',
		'¥': 'YEN',
		'៛': 'KHR',

		// separators
		'–': delimiter,
		'—': delimiter,
		'―': delimiter,
		'~': delimiter,
		'/': delimiter,
		'\\': delimiter,
		'|': delimiter,
		'+': delimiter,
		'‘': delimiter,
		'’': delimiter,
		'\'': delimiter,
		' ': delimiter,

		// permitted by default but can be overridden
		'-': '-',
		'_': '_',
	};

	// add any user-defined separator elements
	if (separators) {
		for (i; i >= 0; --i) {
			sanitizer[separators[i]] = delimiter;
		}
	}

	// do all the replacements
	slug = slug.toLowerCase(); // if we don't do this, add the uppercase versions to the sanitizer plus inlcude A-Z in the prohibited filter
	slug = slug.replace(prohibited, (match) => sanitizer[match] || '');
	slug = slug.replace(consecutive, delimiter);
	slug = slug.replace(trim, '$1');

	return slug;
}
