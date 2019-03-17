/* eslint no-console: 0 */

exports.log = function () {

	/**
	 * Sends the passed arguments to console.log
	 * @category debug
	 * @name log
	 *
	 * @signature {{log}}
	 * @return {null} Sends the current context to console.log
	 *
	 * @signature {{log argument1 ... argumentN}}
	 * @param  {...[mixed]} args Arguments to send to console.log
	 * @return {null}
	 */
	return function log (...args) {
		if (args.length === 1) {
			console.log(this);
		} else {
			console.log(...args.slice(0, -1));
		}
	};
	/***/
};
