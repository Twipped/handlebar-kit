
export default function urlencode () {

	/**
	 * Encodes a string into a URL safe format that can be decoded.
	 * @category strings
	 * @name urlencode
	 *
	 * @signature {{urlencode input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#urlencode}}<TEMPLATE>{{/urlencode}}
	 * @return {string}
	 */
	return function urlencodeHelper (...args) {
		const options = args.pop();

		if (options.fn) return encodeURIComponent(options.fn(this));

		if (args.length) {
			return encodeURIComponent(args[0]);
		}

		throw new Error('Handlebars Helper "urlencode" needs 1 parameter minimum if not used as a block helper');
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
