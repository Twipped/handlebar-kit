
export default function logHelper () {

	/**
	 * Sends the passed arguments to console.log
	 * @name log
	 * @category debug
	 *
	 * @signature {{log}}
	 * @return {null} Sends the current context to console.log
	 *
	 * @signature {{log argument1 ... argumentN}}
	 * @param  {...mixed} args Arguments to send to console.log
	 * @return {null}
	 */
	return function log (...args) {
		if (args.length === 1) {
			console.log(this); // eslint-disable-line no-console
		} else {
			console.log(...args.slice(0, -1)); // eslint-disable-line no-console
		}
	};
	/***/
}
