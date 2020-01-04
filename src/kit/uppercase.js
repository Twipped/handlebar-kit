
export default function uppercase () {

	/**
	 * Uppercase the a string or content block
	 * @category strings
	 * @name uppercase
	 *
	 * @signature {{uppercase input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#uppercase}}<TEMPLATE>{{/uppercase}}
	 * @return {string}
	 */
	return function uppercaseHelper (...args) {
		const options = args.pop();

		if (options.fn) return String(options.fn(this)).toUpperCase();

		if (args.length) {
			return String(args[0]).toUpperCase();
		}

		throw new Error('Handlebars Helper "uppercase" needs 1 parameter minimum if not used as a block helper');
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
