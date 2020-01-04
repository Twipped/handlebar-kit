
export default function padStart () {

	/**
	 * Pads a string with characters on the left side.
	 * @category strings
	 * @name padStart
	 *
	 * @signature {{padStart input length [using]}}
	 * @param  {string} input
	 * @param  {number} length
	 * @param  {string} [using] Optional character to pad with. Defaults to a single space.
	 * @return {string}
	 */
	return function padStartHelper (...args) {
		args.pop();
		const [ input, length, using ] = args;

		return String(input).padStart(length, using);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
