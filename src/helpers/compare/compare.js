
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
			'==':      (l, r) => l == r, // eslint-disable-line eqeqeq
			'===':     (l, r) => l === r,
			'!=':      (l, r) => l != r, // eslint-disable-line eqeqeq
			'!==':     (l, r) => l !== r,
			'<':       (l, r) => l < r,
			'>':       (l, r) => l > r,
			'<=':      (l, r) => l <= r,
			'>=':      (l, r) => l >= r,
			'typeof':  (l, r) => typeof l === r, // eslint-disable-line valid-typeof
			'!typeof': (l, r) => typeof l !== r, // eslint-disable-line valid-typeof
			'%':       (l, r) => l % r,
			'!%':      (l, r) => l % r === 0,
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
