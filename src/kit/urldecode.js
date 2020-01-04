
export default function urldecode () {

	/**
	 * Parses URI encoded string back into its original format
	 * @category strings
	 * @name urldecode
	 *
	 * @signature {{urldecode input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#urldecode}}<TEMPLATE>{{/urldecode}}
	 * @return {string}
	 */
	return function urldecodeHelper (...args) {
		const options = args.pop();

		if (options.fn) return decodeURIComponent(options.fn(this));

		if (args.length) {
			return decodeURIComponent(args[0]);
		}

		throw new Error('Handlebars Helper "urldecode" needs 1 parameter minimum if not used as a block helper');
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
