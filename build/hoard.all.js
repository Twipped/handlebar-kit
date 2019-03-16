/**
 * helper-hoard
 *
 * A collection of helper functions for the Handlebars template engine.
 * Based upon work by @jonschlinkert and @doowb for Assemble.io
 *
 * Copyright (c) 2013-2015, Jarvis Badgley, Jon Schlinkert, Brian Woodward, other contributers
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function (exports) {

exports.gist = function (Handlebars) {
	/**
	 * Creates a Github Gist embed
	 * @category code
	 * @signature {{gist gistId}}
	 * @param  {string|integer} gistId Gist id
	 */
	return function gist (gistId) {
		gistId = Handlebars.Utils.escapeExpression(gistId);
		
		var result = '<script src="https://gist.github.com/' + gistId + '.js"></script>';
		
		return new Handlebars.SafeString(result);
	};
	/***/
};


exports.jsfiddle = function (Handlebars) {
	/**
	 * Embeds a jsfiddle snippet
	 * @category code
	 * @signature {{jsfiddle fiddleId[, tabs]}}
	 * @param  {string} fiddleId
	 * @param  {string} [tabs]    Comma separated list of which tabs to display (result,js,html,css)
	 */
	return function jsfiddle (fiddleId, tabs) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "jsfiddle" needs 1 parameter');
		}

		if (arguments.length === 2) {
			tabs = 'result,js,html,css';
		} else if (Array.isArray(tabs)) {
			tabs = tabs.join(',');
		}
		
		var result = '<iframe width="100%" height="300" src="http://jsfiddle.net/' + fiddleId + '/embedded/' + tabs + '/presentation/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>';
		
		return new Handlebars.SafeString(result);
	};
	/***/
};


exports.link = function (Handlebars) {
	/**
	 * Generate a `<link>` tag for a url (css/html/less)
	 * @category code
	 * @signature {{link url[, rel]}}
	 * @param  {string} url
	 * @param  {string} [rel] File type.
	 */
	return function link (url, rel) {
		if (arguments.length === 2) rel = undefined;
		
		function makeLink(src) {
			if (rel) {
				return new Handlebars.SafeString('<link rel="' + rel + '" href="' + src + '">');
			}

			var ext = src.split('.').pop();
			switch (ext) {
			case 'css':
				return '<link rel="stylesheet" href="' + src + '">';
			case 'less':
				return '<link rel="stylesheet/less" href="' + src + '">';
			case 'html':
				return '<link rel="import" href="' + src + '">';
			}
		}

		if (Array.isArray(url)) {
			return new Handlebars.SafeString(url.map(makeLink).join('\n'));
		} else {
			return new Handlebars.SafeString(makeLink(url));
		}

	};
	/***/
};


exports.ol = function (Handlebars) {
	/**
	 * Generate an ordered list
	 * @category code
	 * @signature {{ol items}}
	 * @param  {array<mixed>} input   Items to be iterated over, outputting directly to as LI contents.
	 *
	 * @signature {{#ol items}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/ol}}
	 * @param  {array<mixed>} input Items to apply the enclosed template against to produce LI contents.
	 * @example
	 * {{#ol emails class="email-list"}}<a href="mailto:{{this}}">{{this}}</a>{{else}}There are no emails.{{/ol}}
	 */
	return function ol (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "ol" needs 1 parameter');
		}

		var stack = ['<ol'];

		if (options.hash) {
			Object.keys(options.hash).forEach(function (key) {
				stack.push(' ' + key + '="' + options.hash[key] + '"');
			});
		}

		stack.push('>');

		if (!Array.isArray(input)) {
			input = [input];
		}

		if (!options.fn) {
			input.forEach(function (item) {
				stack.push('<li>' + Handlebars.Utils.escapeExpression(item) + '</li>');
			});
		} else {
			if (input.length) {
				var data = Handlebars.createFrame(options.data);
				input.forEach(function (item, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === input.length - 1);
					stack.push('<li>' + options.fn(item, {data: data}) + '</li>');
				});
			} else {
				stack.push('<li>' + options.inverse(this) + '</li>');
			}
		}

		stack.push('</ol>');

		return new Handlebars.SafeString(stack.join(''));
	};
	/***/
};


exports.script = function (Handlebars) {
	/**
	 * Generate a `<script>` tag for a url (css/html/less)
	 * @category code
	 * @signature {{script url[ type]}}
	 * @param  {string|array<string>} url
	 * @param  {string} [type]  Mime-type
	 * @return {string}
	 */
	return function script (url, type) {
		if (arguments.length === 2) type = undefined;

		function makeLink(src) {
			if (type) {
				return new Handlebars.SafeString('<script type="' + type + '" src="' + src + '"></script>');
			}

			var ext = src.split('.').pop();
			switch (ext) {
			case 'js':
				return '<script src="' + src + '"></script>';
			case 'coffee':
				return '<script type="text/coffeescript" src="' + src + '"></script>';
			case 'hbs':
				return '<script type="text/handlebars" src="' + src + '"></script>';
			}
		}

		if (Array.isArray(url)) {
			return new Handlebars.SafeString(url.map(makeLink).join('\n'));
		} else {
			return new Handlebars.SafeString(makeLink(url));
		}
	};
	/***/
};


exports.ul = function (Handlebars) {
	/**
	 * Generate an unordered list from an array.
	 * Any named properties will be applied to the UL tag.
	 * @category code
	 * @signature {{ul items}}
	 * @param  {array<mixed>} input   Items to be iterated over, outputting directly to as LI contents.
	 *
	 * @signature {{#ul items}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/ul}}
	 * @param  {array<mixed>} input Items to apply the enclosed template against to produce LI contents.
	 * @example
	 * {{#ul emails class="email-list"}}<a href="mailto:{{this}}">{{this}}</a>{{else}}There are no emails.{{/ul}}
	 */
	return function ul (input, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "ul" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		var stack = ['<ul'];

		if (options.hash) {
			Object.keys(options.hash).forEach(function (key) {
				stack.push(' ' + key + '="' + options.hash[key] + '"');
			});
		}

		stack.push('>');

		if (!Array.isArray(input)) {
			input = [input];
		}

		if (!options.fn) {
			input.forEach(function (item) {
				stack.push('<li>' + Handlebars.Utils.escapeExpression(item) + '</li>');
			});
		} else {
			if (input.length) {
				var data = Handlebars.createFrame(options.data);
				input.forEach(function (item, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === input.length - 1);
					stack.push('<li>' + options.fn(item, {data: data}) + '</li>');
				});
			} else {
				stack.push('<li>' + options.inverse(this) + '</li>');
			}
		}

		stack.push('</ul>');

		return new Handlebars.SafeString(stack.join(''));
	};
	/***/
};


exports.after = function (Handlebars) {
	/**
	 * Returns all of the items in the collection after the specified index.
	 * May be used inline or as an iterator.
	 *
	 * @category collections
	 * @signature {{after items[ count]}}
	 * @param  {Array}  input Collection
	 * @param  {Number} [count] Number of items to exclude
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#after input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/after}}
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#after items, 2}}<span>{{this}}</span>{{/after}}
	 * // Result: <span>c</span><span>d</span><span>e</span><span>f</span>
	 */
	return function after (input, count, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "after" needs 2 parameters');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			count = undefined;
		}

		var results = input.slice(count);
		if (!options.fn) {
			return results;
		} else {
			if (results.length) {
				var data = Handlebars.createFrame(options.data);
				return results.map(function (result, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === results.length - 1);
					return options.fn(result, {data: data});
				}).join('');
			} else {
				return options.inverse(this);
			}
		}
	};
	/***/
};


exports.all = function () {

	function truthy (value) {
		if (Array.isArray(value)) return !!value.length;
		return !!value;
	}

	/**
	 * Tests if all of the values in the provided array or object are truthy.
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{all input}}
	 * @param  {array<mixed>|object<mixed>} input Array whose values must all be truthy, or an object whose properties must all be truthy
	 * @return {boolean}
	 *
	 * @signature {{#all input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/all}}
	 * @example
	 * {{#all flags}}All flags are true.{{else}}Some or none of the flags are true.{{/all}}
	 */
	return function all (input, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "all" needs 1 parameter');
		}
		var i,c, yes = false;
		if (Array.isArray(input)) {
			yes = !!input[0];
			for (i = 1, c = input.length; i < c; i++) {
				
				if (!(yes = yes && truthy(input[i]))) break;

			}
		} else if (input && typeof input === 'object') {
			var keys = Object.keys(input);
			yes = !!keys[0];
			for (i = 1, c = keys.length; i < c; i++) {

				if (!(yes = yes && truthy(input[i]))) break;

			}
		} else if (input) {
			yes = truthy(input[i]);
		}

		if (!options.fn) return yes || '';

		return yes ? options.fn(this) : options.inverse(this);
	};
	/***/
};


exports.any = function () {

	function truthy (value) {
		if (Array.isArray(value)) return !!value.length;
		return !!value;
	}

	/**
	 * Tests if any of the values in the provided array or object are truthy.
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{any input}}
	 * @param  {array<mixed>|object<mixed>} input Array containing any truthy values, or an object with any property that is truthy
	 * @return {boolean}
	 *
	 * @signature {{#any input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/any}}
	 * @example
	 * {{#any flags}}Sore or all flags are true.{{else}}None of the flags are true.{{/any}}
	 */
	return function any (input, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "any" needs 1 parameter');
		}
		var i,c, yes = false;
		if (Array.isArray(input)) {
			for (i = 0, c = input.length; i < c; i++) {
				if (truthy(input[i])) {
					yes = true;
					break;
				}
			}
		} else if (input && typeof input === 'object') {
			var keys = Object.keys(input);
			for (i = 0, c = keys.length; i < c; i++) {
				if (truthy(input[keys[i]])) {
					yes = true;
					break;
				}
			}
		} else if (input) {
			yes = !!input;
		}

		if (!options.fn) return yes || '';

		return yes ? options.fn(this) : options.inverse(this);
	};
	/***/
};

exports.before = function (Handlebars) {
	/**
	 * Returns all of the items in the array before the specified index.
	 * May be used inline or as an iterator.
	 *
	 * @category collections
	 * @signature {{before input[ count]}}
	 * @param  {Array}  input Collection
	 * @param  {Number} [count] Number of items to include
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#before input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/before}}
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#before items 2}}<span>{{this}}</span>{{/before}}
	 * //Result: <span>a</span><span>b</span>
	 */
	return function before (input, count, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "before" needs 2 parameters');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			count = undefined;
		}
		
		var results = input.slice(0, -count);
		if (!options.fn) {
			return results;
		} else {
			if (results.length) {
				var data = Handlebars.createFrame(options.data);
				return results.map(function (result, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === results.length - 1);
					return options.fn(result, {data: data});
				}).join('');
			} else {
				return options.inverse(this);
			}
		}
	};
	/***/
};


exports.empty = function () {
	/**
	 * Tests if the provided input is empty (string, array or object)
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{empty input}}
	 * @param  {string|array|object} input
	 * @return {boolean}
	 *
	 * @signature {{#empty input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/empty}}
	 * @example
	 * // items = ['a']
	 * {{#empty items}}is empty{{else}}is not empty{{/empty}}
	 * // Result: 'is not empty'
	 */
	return function empty (input, options) {
		var yes = false;
		if (Array.isArray(input)) {
			yes = input.length <= 0;
		} else if (typeof input === 'object') {
			var keys = Object.keys(input);
			yes = keys.length <= 0;
		} else {
			yes = !input;
		}

		if (!options.fn) {
			return yes || '';
		} else {
			return yes ? options.fn(this) : options.inverse(this);
		}
	};
	/***/
};


exports.filter = function (Handlebars) {
	/**
	 * Filters a passed array, depending on the arguments provided.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{filter input}} or {{#filter input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
	 * @describe Filter all falsy items (`0`, `''`, `false`, `null`, `undefined`, etc).
	 * @param {array<mixed>} input
	 * @return {array}
	 * @example
	 * // items = [0, 1, null, 'test']
	 * {{#filter items}}<p>{{this}}</p>{{/filter}}
	 * // Result: <p>1</p><p>test</p>
	 *
	 * @signature {{filter input value}} or {{#filter input value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
	 * @describe Filter all items matching the passed value. Else condition evaluates if result is empty.
	 * @param {array<mixed>} input
	 * @param {mixed} value Value to filter.
	 * @return {array}
	 * @example
	 * // items = [0, 1, 2]
	 * {{#filter items 1}}<p>{{this}}</p>{{/filter}}
	 * // Result: <p>0</p><p>2</p>
	 *
	 * @signature {{filter input value property}} or {{#filter input value property}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
	 * @describe Performs a pluck operation, filtering all objects from the array where the provided property name does not match the provided value. (`O[n][property] != value`)
	 * @param {array<mixed>} input
	 * @param {mixed} value Value to filter.
	 * @param {property} [string] Object property name to check against the value
	 * @return {array}
	 * @example
	 * // original = [{a:1}, {b:2}, {a:1,b:2}, {}]
	 * {{#filter original 1 "a"}}|{{#each this}}<span>{{@key}}:{{this}}</span>{{/each}}|{{else}}no{{/filter}}
	 * // Result: '|<span>a:1</span>||<span>a:1</span><span>b:2</span>|'
	 *
	 * @example
	 * // Property and value may be provided as named arguments
	 * // original = [{a:1}, {b:2}, {a:1,b:3}, {}]
	 * {{#filter original property="b" value=2}}|{{#each this}}<span>{{@key}}:{{this}}</span>{{/each}}|{{else}}no{{/filter}}
	 * // Result: '|<span>b:2</span>|'
	 *
	 * @signature {{filter input property=key}} or {{#filter input property=key}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/filter}}
	 * @describe If a property is defined, but not a value, the function will filter all objects from the array where the provided property name is falsy or absent (`0`, `''`, `false`, `null`, `undefined`, etc).
	 * @param {array<mixed>} input
	 * @param {property} [string] Object property name to check against the value
	 * @return {array}
	 * @example
	 * // original = [{a:0}, {b:2}, {a:1,b:2}, {}]
	 * {{#filter original property="a"}}|{{#each this}}<span>{{@key}}:{{this}}</span>{{/each}}|{{else}}no{{/filter}}
	 * // Result: '|<span>a:1</span><span>b:2</span>|'
	 */
	return function filter (input, value, property, options) {

		options = arguments[arguments.length - 1];

		var condition = function (d) { return d; };

		switch (arguments.length) {
		case 1:
			throw new Error('Handlebars Helper "filter" needs at least 1 parameter');
		case 2:
			property = options.hash && options.hash.property;
			value = options.hash && options.hash.value;

			if (property && value) {
				condition = function (d) { return d[property] == value; };
			} else if (property) {
				condition = function (d) { return !!d[property]; };
			} else if (value) {
				condition = function (d) { return d !== value; };
			}
			break;
		case 3:
			condition = function (d) { return d !== value; };
			break;

		default:
			condition = function (d) { return d[property] == value; };
			break;
		}

		var results = input.filter(condition);

		if (!options.fn) return results;

		if(results && results.length > 0) {
			var data = Handlebars.createFrame(options.data);
			return results.map(function (result, i) {
				data.index = i;
				data.first = (i === 0);
				data.last  = (i === results.length - 1);
				return options.fn(result, {data: data});
			}).join('');
		} else {
			return options.inverse(this);
		}

	};
	/***/
};


exports.first = function (Handlebars) {
	/**
	 * Returns the first N items in the passed array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{first input[ count]}}
	 * @param  {Array|Object|String}  input Collection or String
	 * @param  {Number} [count] Number of items to exclude
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#first input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/first}}
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#first items, 2}}<span>{{this}}</span>{{/first}}
	 * // Result: <span>a</span><span>b</span>
	 */
	return function first (input, count, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "first" needs 2 parameters');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			count = 1;
		}

		if (!options.fn) {
			if (input && typeof input === 'object' && !Array.isArray(input)) {
				input = Object.values(input);
			}
			if (Array.isArray(input) || typeof input === 'string') return count > 1 ? input.slice(0, count) : input[0];
		} else {
			
			// received a string
			if (typeof input === 'string') {
				if (!input.length) return options.inverse(this);
				return options.fn(result, input.slice(0, count));
			}

			var data = Handlebars.createFrame(options.data);

			// received an object collection
			if (input && typeof input === 'object' && !Array.isArray(input)) {
				var keys = Object.keys(input);
				if (!keys.length) {
					return options.inverse(this);
				}

				return keys.slice(0, count).map(function (key, i) {
					var result = input[key];
					data.index = i;
					data.key = key;
					data.first = (i === 0);
					data.last  = (i === keys.length - 1);
					return options.fn(result, {data: data});
				}).join ('');
			}

			var results = count ? input.slice(0, count) : [input[0]];
			if (!results.length) {
				return options.inverse(this);
			}

			return results.map(function (result, i) {
				data.index = i;
				data.key = i;
				data.first = (i === 0);
				data.last  = (i === results.length - 1);
				return options.fn(result, {data: data});
			}).join('');
		}
	};
	/***/
};


exports.inArray = function () {
	/**
	 * Checks if a value exists in the passed array.
	 * May be used inline or as a conditional block.
	 *
	 * @category collections
	 * @signature {{inArray input value}}
	 * @param  {array<mixed>} input Array to search
	 * @param  {mixed} value Value to search for
	 * @return {boolean}
	 *
	 * @signature {{#inArray input value}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/inArray}}
	 */
	return function inArray (input, value, options) {
		var result = input.indexOf(value) >= 0;

		if (!options.fn) return result || '';
		
		return result ? options.fn(this) : options.inverse(this);
	};
	/***/
};


exports.join = function (Handlebars) {
	/**
	 * Joins all elements of a collection into a string using a separator if specified.
	 * If used as an iterator block, the block contents will be used as a replacement for the item in the array, and then output after joined.
	 * Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{join items[ separator]}}
	 * @param  {array<mixed>} input
	 * @param  {string} [separator] Defaults to `','`
	 * @return {string}
	 *
	 * @signature {{#join items[ separator]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/join}}
	 */
	return function join (input, separator, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "join" needs at least one parameter');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			separator = undefined;
		}

		if (typeof separator === 'undefined') separator = ',';

		if (!input.length) {
			return options.inverse(this);
		}

		if (options.fn) {
			var data = Handlebars.createFrame(options.data);
			input = input.map(function (result, i) {
				data.index = i;
				data.first = (i === 0);
				data.last  = (i === input.length - 1);
				return options.fn(result, {data: data});
			});
		}
		
		return input.join(separator);
	};
	/***/
};


exports.keys = function (Handlebars) {
	/**
	 * Returns the indexes of an array or the keys of an object.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{keys input}}
	 * @param  {array<mixed>|object} input
	 * @return {array<integer|string>}
	 *
	 * @signature {{#keys}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/keys}}
	 */
	return function keys (input, options) {
		if (!Array.isArray(input) && typeof input === 'object') {
			input = Object.keys(input);
		} else {
			input = input.map(function (v, k) { return k; });
		}

		if (!options.fn) {
			return input;
		} else {
			if (input.length) {
				var data = Handlebars.createFrame(options.data);
				return input.map(function (result, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === input.length - 1);
					return options.fn(result, {data: data});
				}).join('');
			} else {
				return options.inverse(this);
			}
		}
	};
	/***/
};


exports.last = function (Handlebars) {
	/**
	 * Returns the last N items in the passed array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{last input[ count]}}
	 * @param  {Array}  input Collection
	 * @param  {Number} [count] Number of items to exclude
	 * @return {Array} Array excluding the number of items specified
	 *
	 * @signature {{#last input[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/last}}
	 * @example
	 * // items = ['a','b','c','d','e','f']
	 * {{#last items, 2}}<span>{{this}}</span>{{/last}}
	 * // Result: <span>a</span><span>b</span>
	 */
	return function last (input, count, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "last" needs 2 parameters');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			count = 1;
		}

		if (!options.fn) {
			return count > 1 ? input.slice(-count) : input[input.length - 1];
		} else {
			var results = count ? input.slice(-count) : [input[input.length - 1]];
			if (results.length) {
				var data = Handlebars.createFrame(options.data);
				return results.map(function (result, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === results.length - 1);
					return options.fn(result, {data: data});
				}).join('');
			} else {
				return options.inverse(this);
			}
		}

	};
};


exports.length = function () {
	/**
	 * Returns the number of keys on an object, or the length of an array or string.
	 * May be used inline or as an iterator. Else condition evaluates if result is 0.
	 *
	 * @category collections
	 *
	 * @signature {{length input}}
	 * @describe Returns the length of the input
	 * @param {array|object|string} input
	 * @return {integer}
	 *
	 * @signature {{length input target}}
	 * @descibe Returns a boolean if the length matches the passed target.
	 * @param {array|object|string} input
	 * @param {integer} target The target length to check against
	 * @return {boolean}
	 *
	 * @signature {{#length input target}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/length}}
	 * @describe Evaluates block content if the length is greater than 0, else if it is not.
	 * @param {array|object|string} input
	 *
	 * @signature {{#length input target}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/length}}
	 * @describe Evaluates block content if the length matches the target, else block if it does not
	 * @param {array|object|string} input
	 * @param {interger} target The target length it should match in order to evaluate.
	 */
	return function length (input, target, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "length" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			target = false;
		}

		var results;
		if (input.length !== undefined) {
			results = input.length;
		} else if (typeof input === 'object') {
			results = Object.keys(input).length;
		} else {
			results = !!input;
		}

		if (!options.fn) return target === false ? results : results === target && target || 0;

		if (target === false ? results : results === target) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};
	/***/
};


exports.notEmpty = function () {
	/**
	 * Opposite of {{empty}}
	 *
	 * @category collections
	 * @signature {{notEmpty input}}
	 * @param  {string|array|object} input
	 * @return {boolean}
	 *
	 * @signature {{#notEmpty input}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/notEmpty}}
	 * @example
	 * // items = ['a']
	 * {{#notEmpty items}}is not empty{{else}}is empty{{/notEmpty}}
	 * // Result: 'is not empty'
	 */
	return function notEmpty (input, options) {
		var yes = false;
		if (Array.isArray(input)) {
			yes = input.length > 0;
		} else if (typeof input === 'object') {
			var keys = Object.keys(input);
			yes = keys.length > 0;
		} else {
			yes = !!input;
		}

		if (!options.fn) {
			return yes || '';
		} else {
			return yes ? options.fn(this) : options.inverse(this);
		}
	};
	/***/
};


exports.slice = function (Handlebars) {
	/**
	 * Returns a slice of an array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{slice input start[ count]}}
	 * @param  {array<mixed>} input
	 * @param  {integer} start  Index to slice from
	 * @param  {integer} [count]  Number of items to slice.
	 * @return {array}
	 *
	 * @signature {{#slice input start[ count]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/slice}}
	 */
	return function slice (input, start, count, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			throw new Error('Handlebars Helper "slice" needs 2 parameters');
		case 2:
			start = undefined;
			count = undefined;
			break;
		case 3:
			count = undefined;
			break;
		}

		var results = input.slice(start, count);

		if (!options.fn) {
			return results;
		} else {
			if (results.length) {
				var data = Handlebars.createFrame(options.data);
				return results.map(function (result, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === results.length - 1);
					return options.fn(result, {data: data});
				}).join('');
			} else {
				return options.inverse(this);
			}
		}
	};
	/***/
};


exports.sort = function (Handlebars) {
	/**
	 * Sorts the provided array.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{sort input[ key]}}
	 * @param  {array<mixed>} input
	 * @param  {string} [key] If the input is an array of objects, pass this argument to indicate what key should be compared.
	 * @return {array}
	 *
	 * @signature {{#sort input[ key]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/sort}}
	 */
	return function sort (input, key, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "sort" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			key = undefined;
		}

		var results = input.concat();
		if (key === undefined) {
			results.sort();
		} else {
			results.sort(function (a, b) {
				if (typeof a !== 'object' && typeof b !== 'object') return 0;
				if (typeof a !== 'object') return -1;
				if (typeof b !== 'object') return 1;
				return a[key] > b[key];
			});
		}

		if (!options.fn) {
			return results;
		} else {
			if (results.length) {
				var data = Handlebars.createFrame(options.data);
				return results.map(function (result, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === results.length - 1);
					return options.fn(result, {data: data});
				}).join('');
			} else {
				return options.inverse(this);
			}
		}
	};
	/***/
};


exports.split = function (Handlebars) {
	/**
	 * Splits a string into an array.
	 * May be used inline or as an iterator. Else condition will never evaluate.
	 *
	 * @category collections
	 * @signature {{split input[ delimiter]}}
	 * @param  {string} input
	 * @param  {string} [delimiter] Defaults to ',' if not provided.
	 * @return {array<string>}
	 *
	 * @signature {{#split input[ delimiter]}}<TEMPLATE>{{/split}}
	 */
	return function split (input, delimiter, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "split" needs at least 1 parameter');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			delimiter = undefined;
		}

		var results = input.split(delimiter);

		if (!options.fn) {
			return results;
		} else {
			var data = Handlebars.createFrame(options.data);
			return results.map(function (result, i) {
				data.index = i;
				data.first = (i === 0);
				data.last  = (i === results.length - 1);
				return options.fn(result, {data: data});
			}).join('');
		}
	};
	/***/
};


exports.values = function (Handlebars) {
	/**
	 * Returns the values of an array or object.
	 * May be used inline or as an iterator. Else condition evaluates if result is empty.
	 *
	 * @category collections
	 * @signature {{values input}}
	 * @param  {array<mixed>|object} input
	 * @return {array<mixed>}
	 *
	 * @signature {{#values}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/values}}
	 */
	return function values (input, options) {
		if (!Array.isArray(input) && typeof input === 'object') {
			input = Object.keys(input).map(function (k) { return input[k]; });
		}

		if (!options.fn) {
			return input;
		} else {
			if (input.length) {
				var data = Handlebars.createFrame(options.data);
				return input.map(function (result, i) {
					data.index = i;
					data.first = (i === 0);
					data.last  = (i === input.length - 1);
					return options.fn(result, {data: data});
				}).join('');
			} else {
				return options.inverse(this);
			}
		}
	};
	/***/
};


exports.and = function () {

	function truthy (value) {
		if (Array.isArray(value)) return value.length && value;
		return value;
	}

	/**
	 * Tests if all of the passed arguments are truthy.
	 * Empty arrays are counted as falsy.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{and arg1 [... argN]}}
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 * @return {mixed} Returns the first last argument, or first falsy value.
	 *
	 * @signature {{#and arg1 [... argN]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/and}}
	 * @describe Truthy block will evaluate with the result value as the current context ({this}).
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 */

	return function and (a, options) {
		var args = [].slice.call(arguments, 1);
		options = args.pop();

		var i = 0, c = args.length, result = a;
		for (; i < c; i++) {
			result = result && truthy(args[i]);
			if (!result) break;
		}

		if (!options.fn) return result;

		if (result) {
			return options.fn(result);
		} else {
			return options.inverse(this);
		}
	};

	/***/
};


exports.compare = function () {

	/**
	 * Tests two values for equivalence.
	 * May be used inline or as a conditional block.
	 *
	 * Takes the following values as an optional middle argument to identify the comparison to perform.
	 *
	 * - `'=='`: Loose equal
	 * - `'==='`: Strict equal
	 * - `'!='`: Loose unequal
	 * - `'!=='`: Strict unequal
	 * - `'<'` : Less than
	 * - `'>'`: Greater than
	 * - `'<='`: Less than or equal
	 * - `'>='`: Greater than or equal
	 * - `'typeof'`: Typeof first argument equals third argument
	 * - `'!typeof'`: Typeof first argument does not equal third argument
	 * - `'%'`: Modulus of first and third arguments (inline returns result; block evaluates truthy for non-0 result)
	 * - `'!%'`: Modulus of first and third arguments is non-0
	 *
	 * @category comparisons
	 *
	 * @signature {{compare left [operator] right}}
	 * @param  {mixed} left     Left side of the comparison.
	 * @param  {string} [operator] If omitted, is assumed to be strict equality.
	 * @param  {mixed} right    Right side of the comparison
	 * @return {mixed} Returns the value of the comparison
	 *
	 * @signature {{#compare left [operator] right}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/compare}}
	 * @param  {mixed} left     Left side of the comparison.
	 * @param  {string} [operator] If omitted, is assumed to be strict equality.
	 * @param  {mixed} right    Right side of the comparison
	 */
	
	return function compare (left, operator, right, options) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "compare" needs 2 parameters');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 3) {
			right = operator;
			operator = '===';
		}

		var operators = {
			'==':     function(l, r) {return l == r; },
			'===':    function(l, r) {return l === r; },
			'!=':     function(l, r) {return l != r; },
			'!==':    function(l, r) {return l !== r; },
			'<':      function(l, r) {return l < r; },
			'>':      function(l, r) {return l > r; },
			'<=':     function(l, r) {return l <= r; },
			'>=':     function(l, r) {return l >= r; },
			'typeof': function(l, r) {return typeof l === r; },
			'!typeof':function(l, r) {return typeof l !== r; },
			'%':      function(l, r) {return l % r; },
			'!%':     function(l, r) {return l % r === 0; }
		};

		if (!operators[operator]) {
			throw new Error('Handlebars Helper "compare" does not know the operator ' + operator);
		}

		var result = !!operators[operator](left, right);

		if (!options.fn) return result || '';

		return result ? options.fn(this) : options.inverse(this);
	};

	/***/
};


exports.gt = function () {

	/**
	 * Tests if the first argument is greater than the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{gt value test}}
	 * @param  {string|integer} value Greater value
	 * @param  {string|integer} test  Smaller value
	 * @return {boolean}
	 *
	 * @signature {{#gt value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/gt}}
	 */
	
	return function gt (value, test, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "gt" needs 2 parameters');
		}
		
		if (!options.fn) return value > test || '';
		if (value > test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	/***/
};


exports.gte = function () {

	/**
	 * Tests if the first argument is greater than or equal to the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{gte value test}}
	 * @param  {string|integer} value Greater value
	 * @param  {string|integer} test  Smaller value
	 * @return {boolean}
	 *
	 * @signature {{#gte value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/gte}}
	 */
	
	return function gte (value, test, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "gte" needs 2 parameters');
		}

		if (!options.fn) return value >= test || '';
		if (value >= test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	/***/
};


exports.is = function () {

	/**
	 * Tests if the first argument matches any of the other arguments with strict equality.
	 * @category comparisons
	 *
	 * @signature {{is value test1 ... testN}}
	 * @param  {mixed} value Value to check against
	 * @param  {mixed} ...test Values to test
	 * @return {mixed} Matched value
	 *
	 * @signature {{#is value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/is}}
	 * @describe Truthy block will evaluate with the result value as the current context ({this}).
	 */
	
	return function is (value, test, options) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "is" needs a minimum of 2 arguments');
		}

		var args = [].slice.call(arguments);
		
		options = args.pop();
		value = args.shift();

		var result = args.indexOf(value) >= 0;
		
		if (!options.fn) return result || '';

		return result ? options.fn(result) : options.inverse(this);
	};

	/***/
};


exports.isLike = function () {

	/**
	 * Tests if the first argument matches any of the other arguments with loose equality.
	 * @category comparisons
	 *
	 * @signature {{isLike value test1 ... testN}}
	 * @param  {mixed} value Value to check against
	 * @param  {mixed} ...test Values to test
	 * @return {mixed} Matched value
	 *
	 * @signature {{#isLike value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/isLike}}
	 * @describe Truthy block will evaluate with the result value as the current context ({this}).
	 */
	
	return function isLike (value, test, options) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "isLike" needs a minimum of 2 arguments');
		}

		var args = [].slice.call(arguments);
		
		options = args.pop();
		value = args.shift();

		var result = false;
		var i = args.length;
		while (i-- && !result) {
			result = result || (value == args[i]);
		}

		if (!options.fn) return result || '';
		
		return result ? options.fn(this) : options.inverse(this);
	};

	/***/
};


exports.isNot = function () {

	/**
	 * Tests that the first argument does not match any of the other arguments with strict equality.
	 * @category comparisons
	 *
	 * @signature {{isNot value test1 ... testN}}
	 * @param  {mixed} value Value to check against
	 * @param  {mixed} ...test Values to test
	 * @return {mixed} Matched value
	 *
	 * @signature {{#isNot value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/isNot}}
	 */
	
	return function isNot (value, test, options) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "isNot" needs a minimum of 2 arguments');
		}

		var args = [].slice.call(arguments);
		
		options = args.pop();
		value = args.shift();

		var result = args.indexOf(value) === -1;

		if (!options.fn) return result || '';

		return result ? options.fn(this) : options.inverse(this);
	};

	/***/
};


exports.isNotLike = function () {

	/**
	 * Tests that the first argument does not match any of the other arguments with loose equality.
	 * @category comparisons
	 *
	 * @signature {{isNotLike value test1 ... testN}}
	 * @param  {mixed} value Value to check against
	 * @param  {mixed} ...test Values to test
	 * @return {mixed} Matched value
	 *
	 * @signature {{#isNotLike value test1 ... testN}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/isNotLike}}
	 */
	
	return function isNotLike (value, test, options) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "isNotLike" needs a minimum of 2 arguments');
		}

		var args = [].slice.call(arguments);
		
		options = args.pop();
		value = args.shift();

		var result = true;
		var i = args.length;
		while (i-- && result) {
			result = result && (value != args[i]);
		}

		if (!options.fn) return result || '';
		
		return result ? options.fn(this, options) : options.inverse(this, options);
	};

	/***/
};

exports.lt = function () {

	/**
	 * Tests if the first argument is less than the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{lt value test}}
	 * @param  {string|integer} value Smaller value
	 * @param  {string|integer} test  Greater value
	 * @return {boolean}
	 *
	 * @signature {{#lt value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/lt}}
	 */
	
	return function lt (value, test, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "lt" needs 2 parameters');
		}

		if (!options.fn) return value < test || '';
		if (value < test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	/***/
};


exports.lte = function () {

	/**
	 * Tests if the first argument is less than or equal to the second argument.
	 * May be used inline or as a conditional block.
	 * @category comparisons
	 *
	 * @signature {{lte value test}}
	 * @param  {string|integer} value Smaller value
	 * @param  {string|integer} test  Greater value
	 * @return {boolean}
	 *
	 * @signature {{#lte value test}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/lte}}
	 */
	
	return function lte (value, test, options) {
		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "lte" needs 2 parameters');
		}

		if (!options.fn) return value <= test || '';
		if (value <= test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};

	/***/
};


exports.or = function () {

	function truthy (value) {
		if (Array.isArray(value)) {
			if (value.length) return true;
			else return false;
		}
		return !!value;
	}

	/**
	 * Tests if any of the passed arguments are truthy.
	 * Empty arrays are counted as being falsy.
	 * May be used inline or as a conditional block.
	 * @name or
	 * @category comparisons
	 *
	 * @signature {{or arg1 [... argN]}}
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 * @return {boolean} Returns the first truthy argument found, or last argument if none found.
	 *
	 * @signature {{#or arg1 [... argN]}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/or}}
	 * @describe Truthy block will evaluate with the truthy value as the current context ({this}).
	 * @param {mixed} [argN] Some value to be checked for truthiness
	 */

	return function or (options) {
		var args = [].slice.call(arguments);
		options = args.pop();

		var i = 0,
			c = args.length,
			result;


		for (; i < c; i++) {
			result = args[i];
			if (truthy(result)) {
				break;
			}
		}

		if (!options.fn) return result;

		if (truthy(result)) {
			return options.fn(result);
		} else {
			return options.inverse(this);
		}
	};

	/***/
};


exports.default = function () {

	function truthy (value) {
		if (Array.isArray(value)) return value.length && value;
		return value;
	}

	/**
	 * Outputs a fallback value if the first argument is falsy.
	 * @category data
	 * @name default
	 *
	 * @signature {{default value fallback}}
	 * @param  {mixed} value
	 * @param  {mixed} fallback
	 * @return {mixed}
	 *
	 * @signature {{#default value fallback}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/default}}
	 */
	
	return function (value, fallback, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length !== 3) {
			throw new Error('Handlebars Helper "default" needs 2 parameters');
		}

		return truthy(value) || fallback;
	};
};

exports.inject = function () {

	/**
	 * Any values passed as named arguments are injected into the handlebars data context, using the name provided for each argument.
	 * @category data
	 * @name inject
	 *
	 * @signature {{inject key=value [key2=value2] ...}}
	 * @describe Inserts into the current context.
	 *
	 * @signature {{#inject key=value [key2=value2] ...}}<TEMPLATE>{{/inject}}
	 * @describe Inserts into the context of the tag block.
	 */
	
	return function inject (options) {
		var context = this;

		options = arguments[arguments.length - 1];

		if (options.fn) {
			context = Object.create(this || null);
		}

		if (options.hash) {
			Object.keys(options.hash).forEach(function (key) {

				var value = options.hash[key];
				if (String(value)[0] === '{') {
					value = JSON.parse(value);
				}

				context[key] = value;
			});
		}

		return options.fn && options.fn(context) || '';
	};

	/***/
};


exports.stringify = function (Handlebars) {

	/**
	 * Converts the passed value into JSON.
	 * Does not support block syntax.
	 * @category data
	 * @name stringify
	 *
	 * @signature {{stringify input [pretty]}}
	 * @param  {mixed} input    Value to be stringified
	 * @param  {boolean} pretty Controls if the json should be tab indented.
	 * @return {string} The formatted JSON.
	 */
	
	return function stringify (input, pretty, options) {

		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "stringify" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2) {
			pretty = undefined;
		} else {
			if (pretty && typeof pretty !== 'string') {
				pretty = '  ';
			}
		}

		return new Handlebars.SafeString(JSON.stringify(input, undefined, pretty));
	};

	/***/
};


exports.date = function () {

	/**
	 * Outputs a date formatted using moment notation.
	 * Depends on the `moment` library. Moment will be searched for by first accessing a `require` function (if present) before checking global contexts.
	 * @category date
	 * @name date
	 *
	 * @signature {{date format}}
	 * @describe Outputs the current date/time
	 * @param  {string} format  Moment formatting
	 * @return {string}
	 *
	 * @signature {{date format input [parse=<string>]}}
	 * @param  {string} format  Moment formatting
	 * @param  {string|Date} input   The date value to be formatted. Must be either a Date object, parsable by Date(input), or parsable using a providing parsing string.
	 * @param {string} [parse] If a `parse` attribute is provided, it will be used for instructing moment on how to parse the input.
	 * @return {string}
	 */
	
	return function date (format, input, options) {
		var moment = (typeof require === 'function' && require('moment')) || ((typeof window !== 'undefined' && window) || (typeof global !== 'undefined' && global) || {}).moment;
		if (!moment) {
			throw new Error('Handlebars Helper "date" requires that the Moment.js library be loaded before using in a template.');
		}

		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			format = 'YYYY-MM-DD HH:mm:ss';
			input = moment();
			break;
		case 2:
			input = moment();
			break;
		case 3:
			var parse = options.hash && options.hash.parse || undefined;
			if (parse) {
				input = moment(input, parse);
			} else {
				input = moment(new Date(input));
			}
			break;
		}

		if (!input.isValid()) {
			return '';
		}

		return input.format(format);
	};

	/***/
};

exports.date.needs = ['moment'];


exports.fromNow = function () {

	/**
	 * Outputs how much time has elapsed or will elapse between now and the passed date.
	 * Depends on the `moment` library. Moment will be searched for by first accessing a `require` function (if present) before checking global contexts.
	 * @category date
	 * @name fromNow
	 *
	 * @signature {{fromNow input [parse=<string>]}}
	 * @param  {string|Date} input   The date value to be formatted. Must be either a Date object, parsable by Date(input), or parsable using a providing parsing string.
	 * @param {string} [parse] If a `parse` attribute is provided, it will be used for instructing moment on how to parse the input.
	 * @return {string}
	 */
	
	return function fromNow (input, options) {
		var moment = (typeof require === 'function' && require('moment')) || ((typeof window !== 'undefined' && window) || (typeof global !== 'undefined' && global) || {}).moment;
		if (!moment) {
			throw new Error('Handlebars Helper "date" requires that the Moment.js library be loaded before using in a template.');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "fromNow" needs 1 parameter');
		} else {
			var parse = options.hash && options.hash.parse || undefined;
			if (parse) {
				input = moment(input, parse);
			} else {
				input = moment(new Date(input));
			}
		}

		if (!input.isValid()) {
			return '';
		}

		return input.fromNow();
	};

	/***/
};

exports.fromNow.needs = ['moment'];


exports.log = function () {
	return function () {
		if (arguments.length === 1) {
			console.log(this);
		} else {
			var args = [].slice.call(arguments, 0, arguments.length - 1);
			console.log(args);
		}
	};
};


exports.embed = function (Handlebars) {
	return function (src, cwd) {
		var fs = require('fs');
		var path = require('path');

		switch (arguments.length) {
		case 1:
			throw new Error('Handlebars Helper "embed" needs 1 parameter');
		case 2:
			cwd = process.cwd();
		}

		var filepath = path.resolve(cwd, src);
		var content = fs.readFileSync(filepath);
		
		return new Handlebars.SafeString(content);
	};
};

exports.embed.noBrowser = true;

exports.append = function () {
	return function (name, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "append" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: 'append',
			fn: options.fn
		};
	};
};


exports.block = function (Handlebars) {
	return function (name, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "block" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		this._blocks = this._blocks || {};
		
		var block = this._blocks[name];

		var optionsFn = options.fn || function () {return '';};

		var result;
		switch (block && block.fn && block.mode) {
		case 'append':
			result = optionsFn(this) + block.fn(this);
			break;
		case 'prepend':
			result = block.fn(this) + optionsFn(this);
			break;
		case 'replace':
			result = block.fn(this);
			break;
		default:
			result = optionsFn(this);
			break;
		}

		return new Handlebars.SafeString(result);
	};
};


exports.content = function () {
	return function (name, mode, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "content" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		if (!mode || arguments.length === 2) {
			mode = options.hash && options.hash.mode || 'replace';
		}

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: mode.toLowerCase(),
			fn: options.fn
		};
	};
};


exports.extend = function (Handlebars) {
	return function (layout, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "extend" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		var context = Object.create(this || null);
		var template = Handlebars.partials[layout];

		if (typeof template === 'undefined') {
			throw new Error("Missing layout: '" + layout + "'");
		}

		if (typeof template === 'string') {
			template = Handlebars.compile(template);
		}

		if (options.fn) {
			// run the contents of the embed so that the content blocks apply
			// but don't use the output.
			options.fn(context);
		}

		return new Handlebars.SafeString(template(context));
	};
};


exports.prepend = function () {
	return function (name, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "prepend" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: 'prepend',
			fn: options.fn
		};
	};
};


exports.add = function () {
	return function () {
		if (arguments.length <= 1) {
			throw new Error('Handlebars Helper "block" needs 1 parameter minimum');
		}

		var value = 0;

		//with the arguments array as an entry point, descend into any sub-arrays for values to add to the total.
		(function descend(level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				value += parseInt(level, 10);
			}
		})([].slice.call(arguments, 0, arguments.length - 1));

		return value;
		
	};
};


exports.ceil = function () {
	return function (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "ceil" needs 1 parameter minimum');
		}

		return Math.ceil(value);
	};
};


exports.div = function () {
	return function () {
		if (arguments.length <= 1) {
			throw new Error('Handlebars Helper "div" needs 1 parameter minimum');
		}

		var value;

		//with the arguments array as an entry point, descend into any sub-arrays for values to divide the initial value by.
		(function descend(level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				if (value === undefined) {
					value = parseInt(level, 10);
				} else if (level) {
					value = value / parseInt(level, 10);
				}			}
		})([].slice.call(arguments, 0, arguments.length - 1));

		return value;
		
	};
};


exports.floor = function () {
	return function (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "floor" needs 1 parameter minimum');
		}

		return Math.floor(value);
		
	};
};


exports.max = function () {
	return function () {
		if (arguments.length <= 1) {
			throw new Error('Handlebars Helper "max" needs 1 parameter minimum');
		}

		var value;

		//with the arguments array as an entry point, descend into any sub-arrays for values to min against
		(function descend(level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				if (value === undefined) {
					value = parseInt(level, 10);
				} else {
					value = Math.max(value, parseInt(level, 10));
				}
			}
		})([].slice.call(arguments, 0, arguments.length - 1));

		return value;
		
	};
};


exports.min = function () {
	return function () {
		if (arguments.length <= 1) {
			throw new Error('Handlebars Helper "min" needs 1 parameter minimum');
		}

		var value;

		//with the arguments array as an entry point, descend into any sub-arrays for values to min against
		(function descend(level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				if (value === undefined) {
					value = parseInt(level, 10);
				} else {
					value = Math.min(value, parseInt(level, 10));
				}
			}
		})([].slice.call(arguments, 0, arguments.length - 1));

		return value;
		
	};
};


exports.mul = function () {
	return function () {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "mul" needs 1 parameter minimum');
		}

		var value = 1;

		//with the arguments array as an entry point, descend into any sub-arrays for values to multiply the initial value by.
		(function descend(level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				value = value * parseInt(level, 10);
			}
		})([].slice.call(arguments, 0, arguments.length - 1));

		return value;
		
	};
};


exports.pi = function () {
	return function () {
		return Math.PI;
	};
};


exports.pow = function () {
	return function (valueA, valueB) {
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "pow" needs 2 parameters minimum');
		}

		return Math.pow(valueA, valueB);
	};
};


exports.random = function () {
	return function (low, high) {
		switch (arguments.length) {
		case 1:
			return Math.random();
		case 2:
			low = 0;
			high = arguments[0];
			break;
		}

		return Math.floor(Math.random()*(high-low)+low);
	};
};


exports.round = function () {
	return function (value) {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "round" needs 1 parameter minimum');
		}

		return Math.round(value);
	};
};


exports.sub = function () {
	return function () {
		if (arguments.length < 2) {
			throw new Error('Handlebars Helper "sub" needs 1 parameter minimum');
		}

		var value;

		//with the arguments array as an entry point, descend into any sub-arrays for values to subtract from the initial value.
		(function descend(level) {
			if (Array.isArray(level)) {
				level.forEach(descend);
			} else {
				if (value === undefined) {
					value = parseInt(level, 10);
				} else {
					value = value - parseInt(level, 10);
				}
			}
		})([].slice.call(arguments, 0, arguments.length - 1));

		return value;
		
	};
};


exports.contains = function () {
	return function (haystack, needle, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "contains" needs 2 parameters');
		}

		if (options.hash && options.hash.regex) {
			needle = new RegExp(needle);
		}

		var result = haystack.split(needle).length - 1;

		if (!options.fn) {
			return result;
		}

		return result ? options.fn(this) : options.inverse(this);

	};
};

exports.endsWith = function () {
	return function (haystack, needle, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "endsWith" needs 2 parameters');
		}

		//make sure we have strings
		haystack = ''+haystack;
		needle = ''+needle;

		var result = haystack.substr(-needle.length) === needle;

		if (!options.fn) {
			return result || '';
		}

		return result ? options.fn(this) : options.inverse(this);
	};
};


exports.humanBytes = function () {
	return function (value) {
		var bytes = Math.abs(parseInt(value, 10));
		if (isNaN(bytes)) {
			console.error("Handlebars helper fileSize couldn't parse '" + value + "'");
			return value; // Graceful degradation
		}
		
		var resInt, resValue;
		var metric = ['byte', 'bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes === 0) {
			resInt = resValue = 0;
		} else {
			// Base 1000 (rather than 1024) matches Mac OS X
			resInt = Math.floor(Math.log(bytes) / Math.log(1000));
			// No decimals for anything smaller than 1 MB
			resValue = (bytes / Math.pow(1000, Math.floor(resInt)));
			//only show a decimal place if the decimal will round to something other than .0
			resValue = resValue.toFixed(resValue % 1 > 0.1 ? 1 : 0);
			if (bytes === 1) {
				resInt = -1; // special case: 1 byte (singular)
			}
		}
		if (resInt + 1 < metric.length) {
			return resValue + ' ' + metric[resInt + 1];
		} else {
			//The number we have is higher than our highest unit, so express it as a value of our highest unit
			return resValue * Math.pow(10, metric.length + 2 - resInt) + ' ' + metric[metric.length - 1];
		}
		
	};
};


exports.humanMilliseconds = function () {
	return function (seconds, detailed) {

		switch (arguments.length) {
		case 1:
			throw new Error('Handlebars Helper "humanMilliseconds" needs 1 parameter');
		case 2:
			detailed = false;
			break;
		}

		var keys  = ['Year',      'Month',    'Week',    'Day',    'Hour',    'Minute',    'Second', 'Millisecond'],
			divs  = [31536000000, 2592000000, 604800000, 86400000, 3600000,   60000,       1000,     1],
			stack = [],
			level = 0,
			value;

		seconds = Math.abs(seconds);

		while (seconds) {
			value = Math.floor(seconds / divs[level]);
			seconds = seconds % divs[level];
			if (value) {
				stack.push( value + ' ' + keys[level] + (value > 1 ? 's' : ''));
				if (!detailed) break;
			}
			level++;
		}

		return stack.join(' ');

	};
};


exports.humanNumber = function () {
	return function (number, digits, options) {
		if (arguments.length < 1) {
			throw new Error('Handlebars Helper "numberAbbr" needs 1 parameter minimum');
		}

		options = arguments[arguments.length - 1];

		if (arguments.length === 2 || digits === undefined) {
			digits = 2;
		}

		digits = Math.pow(10, digits);

		var abbr = ["k", "m", "b", "t"];

		var i = abbr.length - 1;

		while (i >= 0) {
			var size = Math.pow(10, (i + 1) * 3);
			if (size <= number) {
				number = Math.round(number * digits / size) / digits;

				// Special case where we round up to the next abbreviation
				if ((number === 1000) && (i < abbr.length - 1)) {
					number = 1;
					i++;
				}
				
				number += abbr[i];
				break;
			}
			i--;
		}
		return number;
	};
};


exports.humanSeconds = function () {
	return function (seconds, detailed) {

		switch (arguments.length) {
		case 1:
			throw new Error('Handlebars Helper "humanSeconds" needs 1 parameter');
		case 2:
			detailed = false;
			break;
		}

		var keys  = ['Year',  'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
			divs  = [31536000, 2592000, 604800, 86400, 3600,   60,       1],
			stack = [],
			level = 0,
			value;

		seconds = Math.abs(seconds);

		while (seconds) {
			value = Math.floor(seconds / divs[level]);
			seconds = seconds % divs[level];

			//if we're on the last unit and the remaining seconds is greater than half the current unit size
			if (level === divs.length - 1 && seconds > divs[level] / 2) {
				//round up
				value++;
			}

			if (value) {
				stack.push( value + ' ' + keys[level] + (value > 1 ? 's' : ''));
				if (!detailed) break;
			}
			level++;
		}

		return stack.join(' ');

	};
};


exports.inflect = function () {
	return function (count, singular, plural, include, options) {
		if (arguments.length < 4) {
			throw new Error('Handlebars Helper "inflect" needs 3 parameters');
		}

		options = arguments[arguments.length - 1];

		var word = count > 1 || count === 0 ? plural : singular;
		if (arguments.length <= 4 || include === undefined || include === false) {
			return word;
		} else {
			return "" + count + " " + word;
		}
	};
};


exports.lowercase = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "lowercase" needs 1 parameter minimum');
			} else {
				input = options.fn(this);
			}
		}

		return (''+input).toLowerCase();
	};
};


exports.numberFormat = function () {
	return function (number, precision, decimalPoint, thousands) {
		// account for options argument
		var argc = arguments.length - 1;

		if (argc === 0) {
			throw new Error('Handlebars Helper "numberFormat" needs 1 parameter minimum');
		}

		if (argc === 3 || thousands === undefined) {
			thousands = ',';
		}

		if (argc === 2 || decimalPoint === undefined) {
			decimalPoint = '.';
		}

		if (argc === 1 || precision === undefined) {
			precision = 0;
		} else {
			precision = parseInt(precision, 10);
		}

		//strip any non-numeric characters
		number = ('' + number).replace(/[^0-9+\-Ee.]/g, '');

		var result;
		if (precision) {
			// round at the needed precision and then split on the decimal.
			var k = Math.pow(10, precision);
			result = ('' + Math.round(number * k) / k).split('.');

			// if no decimal existed, make sure we create a place for it.
			if (result.length === 1) result.push('');
		} else {
			// parse as float and round off, then store in an array to simplify below.
			result = [Math.round(parseFloat(number))];
		}

		//insert any thousands marks as needed
		if (thousands) {
			result[0] = ('' + result[0]).replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands);
		}

		// pad out the decimal places as needed
		if (precision && result[1].length < precision) {
			result[1] += new Array(precision - result[1].length + 1).join('0');
		}

		return precision ? result.join(decimalPoint) : result[0];
		
	};
};


exports.ordinalize = function () {
	return function (value) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "ordinalize" needs 1 parameter');
		}

		var normal = Math.abs(Math.round(value));
		if ([11, 12, 13].indexOf(normal % 100) >= 0) {
			return "" + value + "th";
		} else {
			switch (normal % 10) {
			case 1:
				return "" + value + "st";
			case 2:
				return "" + value + "nd";
			case 3:
				return "" + value + "rd";
			default:
				return "" + value + "th";
			}
		}
	};
};


exports.padCenter = function () {
	return function (input, length, using, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "padCenter" needs 2 parameters minimum');
			} else {
				input = options.fn(this);
				length = options.hash && options.hash.size || 0;
				using = options.hash && options.hash.using || ' ';
			}
			break;
		case 2:
			length = options.hash && options.hash.size || 0;
			using = options.hash && options.hash.using || ' ';
			break;
		case 3:
			using = options.hash && options.hash.using || ' ';
			break;
		}

		//make sure we've got a string
		input = ''+input;

		if (length < input.length) {
			return input;
		}

		var len   = input.length,
			left  = Math.floor((length - len) / 2),
			right = Math.ceil((length - len) / 2);

		return new Array(left + 1).join(using) + input + new Array(right + 1).join(using);

	};
};


exports.padLeft = function () {
	return function (input, length, using, options) {
		options = arguments[arguments.length - 1];
		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "padLeft" needs 2 parameters minimum');
			} else {
				input = options.fn(this);
				length = options.hash && options.hash.size || 0;
				using = options.hash && options.hash.using || ' ';
			}
			break;
		case 2:
			length = options.hash && options.hash.size || 0;
			using = options.hash && options.hash.using || ' ';
			break;
		case 3:
			using = options.hash && options.hash.using || ' ';
			break;
		}

		//make sure we've got a string
		input = ''+input;

		if (length < input.length) {
			return input;
		}

		return input + new Array(length - input.length + 1).join(using);

	};
};


exports.padRight = function () {
	return function (input, length, using, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "padRight" needs 2 parameters minimum');
			} else {
				input = options.fn(this);
				length = options.hash && options.hash.size || 0;
				using = options.hash && options.hash.using || ' ';
			}
			break;
		case 2:
			length = options.hash && options.hash.size || 0;
			using = ' ';
			break;
		case 3:
			using = options.hash && options.hash.using || ' ';
			break;
		}

		//make sure we've got a string
		input = ''+input;

		if (length < input.length) {
			return input;
		}

		return new Array(length - input.length + 1).join(using) + input;

	};
};


exports.phone = function () {
	return function (number) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "phoneNumber" needs 1 parameter minimum');
		}

		//strip non digits
		number = (''+number).replace(/[^0-9]/, '');

		if (number.length < 10) {
			return number;
		}

		var stack = ['(', number.substr(-10,3), ') ', number.substr(-7, 3), '-', number.substr(-4)];

		if (number.length > 10) {
			stack.unshift(number.substr(0, number.length - 10)+' ');
		}

		return stack.join('');
	};
};


exports.replace = function () {
	return function (haystack, needle, replacement, options) {
		options = arguments[arguments.length - 1];

		var hashNeedle = options.hash && options.hash.search,
			hashReplace = options.hash && options.hash.replace,
			hashRegex = options.hash && options.hash.regex;

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				if (hashNeedle === undefined) {
					throw new Error('Handlebars Helper "replace" needs a search string');
				}
			} else {
				haystack = options.fn(this);
				needle = hashNeedle;
				replacement = hashReplace || '';
			}
			break;

		case 2:
			if (!options.fn) {
				if (hashNeedle === undefined) {
					throw new Error('Handlebars Helper "replace" needs a search string');
				}

				needle = hashNeedle || arguments[0];
				replacement = hashReplace || '';
			} else {
				haystack = options.fn(this);
				needle = hashNeedle || arguments[0];
				replacement = hashReplace || '';
			}
			break;
		case 3:
			if (!options.fn) {
				replacement = '';
			} else {
				haystack = options.fn(this);
				needle = hashNeedle || arguments[0];
				replacement = hashReplace || arguments[1];
			}
			break;
		}

		if (hashRegex) {
			needle = new RegExp(needle);
		}

		return haystack.replace(needle, replacement);

	};
};


exports.reverse = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length === 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "reverse" needs 1 parameter minimum');
			}

			input = options.fn(this);
		}

		if (typeof input === 'string') {
			return input.split('').reverse().join('');
		} else if (typeof input === 'number') {
			return 0-input;
		} else if (Array.isArray(input)) {
			return input.reverse();
		} else {
			throw new Error('Handlebars Helper "reverse" cannot operate upon '+(typeof input)+'s.');
		}

	};
};


exports.slugify = function () {
	return function (input, delimiter, separators, options) {
		options = arguments[arguments.length - 1];

		switch (arguments.length) {
		case 1:
			throw new Error('Handlebars Helper "slugify" needs 1 parameter');
		case 2:
			delimiter = '-';
			separators = false;
			break;
		case 3:
			separators = false;
			break;
		}

		delimiter = delimiter || '-';
		var i = separators && separators.length,
			slug = input,
			regexEscape = new RegExp(/[[\/\\^$*+?.()|{}\]]/g),
			regexDelimiter = delimiter.replace(regexEscape, "\\$&"),
			prohibited = new RegExp("([^a-z0-9" + regexDelimiter + "])", "g"),
			consecutive = new RegExp("(" + regexDelimiter + "+)", "g"),
			trim = new RegExp("^" + regexDelimiter + "*(.*?)" + regexDelimiter + "*$"),
			sanitizer = {
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
				'_': '_'
			};

		// add any user-defined separator elements
		if (separators) {
			for (i; i >= 0; --i) {
				sanitizer[separators[i]] = delimiter;
			}
		}

		// do all the replacements
		slug = slug.toLowerCase(); // if we don't do this, add the uppercase versions to the sanitizer plus inlcude A-Z in the prohibited filter
		slug = slug.replace(prohibited, function (match) { return sanitizer[match] || ''; });
		slug = slug.replace(consecutive, delimiter);
		slug = slug.replace(trim, "$1");

		return slug;
	};
};


exports.startsWith = function () {
	return function (haystack, needle, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "startsWith" needs 2 parameters');
		}

		//make sure we have strings
		haystack = ''+haystack;
		needle = ''+needle;

		var result = haystack.substr(0,needle.length) === needle;

		if (!options.fn) {
			return result || '';
		}

		return result ? options.fn(this) : options.inverse(this);
	};
};


exports.truncate = function () {
	return function (input, length, suffix, options) {
		options = arguments[arguments.length - 1];

		var hashLength = options.hash && options.hash.length,
			hashSuffix = options.hash && options.hash.suffix;

		switch (arguments.length) {
		case 1:
			if (!options.fn) {
				throw new Error('Handlebars Helper "truncate" needs 2 parameters minimum');
			} else if (hashLength === undefined) {
				throw new Error('Handlebars Helper "truncate" needs a length');
			} else {
				input = options.fn(this);
				length = hashLength || 0;
				suffix = hashSuffix || '\u2026';
			}
			break;

		case 2:
			if (!options.fn) {
				if (hashLength === undefined) {
					throw new Error('Handlebars Helper "truncate" needs 2 parameters minimum');
				}
				length = hashLength;
			} else {
				input = options.fn(this);
				length = arguments[0];
				suffix = hashSuffix || '\u2026';
			}
			break;

		case 3:
			if (!options.fn) {
				suffix = hashSuffix || '\u2026';
			} else {
				input = options.fn(this);
				length = arguments[0];
				suffix = hashSuffix || '\u2026';
			}
			break;
		}

		//make sure we've got a string
		input = ''+input;

		if (length > input.length) {
			return input;
		}

		return input.substring(0, length - suffix.length).replace(/^\s+|\s+$/gm, '') + suffix;
	};
};


exports.ucfirst = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "ucfirst" needs 1 parameter minimum');
			} else {
				input = options.fn(this);
			}
		}

		if(input && typeof input === "string") {
			return input.charAt(0).toUpperCase() + input.slice(1);
		} else {
			return '';
		}
	};
};


exports.ucsentences = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "ucwords" needs 1 parameter minimum');
			} else {
				input = options.fn(this);
			}
		}

		if(input && typeof input === "string") {
			return input.replace(/((?:\S[^\.\?\!]*)[\.\?\!]*)/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		} else {
			return '';
		}
	};
};


exports.ucwords = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "ucwords" needs 1 parameter minimum');
			} else {
				input = options.fn(this);
			}
		}

		if(input && typeof input === "string") {
			return input.replace(/\w\S*/g, function (word) {
				return word.charAt(0).toUpperCase() + word.substr(1);
			});
		} else {
			return '';
		}
	};
};


exports.uppercase = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length <= 1) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "uppercase" needs 1 parameter minimum');
			} else {
				input = options.fn(this);
			}
		}

		return (''+input).toUpperCase();
	};
};


exports.urldecode = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 2) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "urldecode" needs 1 parameter minimum');
			}

			input = options.fn(this);
		}

		return decodeURIComponent(input);

	};
};


exports.urlencode = function () {
	return function (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length < 2) {
			if (!options.fn) {
				throw new Error('Handlebars Helper "urlencode" needs 1 parameter minimum');
			}
			
			input = options.fn(this);
		}

		return encodeURIComponent(input);

	};
};


function load (Handlebars) {
	var args = [],
		c,
		helper;

	// flatten the arguments tree
	(function descend(level) {
		if (Array.isArray(level)) {
			level.forEach(descend);
		} else {
			args.push(level);
		}
	})(Array.prototype.slice.call(arguments, 1));

	c = args.length;

	// if no helpers were defined, load all of them.
	if (!c) {
		args = Object.keys(exports);
		c = args.length;
	}

	while (c--) {
		helper = exports[args[c]].call(this, Handlebars);
		Handlebars.registerHelper(args[c], helper);
	}
}

load.load = load;
load.helpers = exports;

//CommonJS Loader
if ( typeof module === 'object' && module && typeof module.exports === 'object' ) {module.exports = load;}

//AMD Loader
if ( typeof define === 'function' && define.amd ) {define(function () { return load; });}

//Global Namespace
var previous, context = (typeof window !== "undefined" && window) || (typeof global !== "undefined" && global) || this;
if (context) {
    previous = context["HelperHoard"];
    context["HelperHoard"] = load;
    load.noConflict = function () {context["HelperHoard"] = previous;return load;};
}

})({});