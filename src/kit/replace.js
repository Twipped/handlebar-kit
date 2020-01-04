
export default function replace () {

	/**
	 * Searches for a needle within a haystack and substitutes a replacement for all matchs.
	 * @category strings
	 * @name replace
	 *
	 * @signature {{replace haystack needle replacement regex}}
	 * @param  {string} haystack
	 * @param  {string|RegExp} needle
	 * @param  {string} replacement
	 * @param  {boolean} [regex] Pass true to evaluate needle as a regular expression
	 * @return {string}
	 */
	return function replaceHelper (...args) {
		args.pop();
		const haystack = String(args[0]);
		const needle = args[3] ? new RegExp(args[1]) : needle;
		const replacement = args[2] || '';
		const regex = needle instanceof RegExp;

		return regex ? haystack.replace(needle, replacement) : haystack.split(needle).join(replacement);
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
