
export default function padEnd () {

	/**
	 * Pads a string with characters on the right side.
	 * @category strings
	 * @name padEnd
	 *
	 * @signature {{padEnd input length [using]}}
	 * @param  {string} input
	 * @param  {number} length
	 * @param  {string} [using] Optional character to pad with. Defaults to a single space.
	 * @return {string}
	 */
	return function padEndHelper (...args) {
		args.pop();
		const [ input, length, using ] = args;

		return String(input).padEnd(length, using);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
