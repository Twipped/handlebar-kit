
export default function stringify (Handlebars) {

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

	return function stringifyHelper (...args) {
		args.pop();
		const [ input, pretty ] = args;

		if (!args.length) {
			throw new Error('Handlebars Helper "stringify" needs at least 1 parameter');
		}

		return new Handlebars.SafeString(JSON.stringify(input, undefined, pretty));
	};

	/***/
}

export function test (t) {
	// t.simple({
	// });
}