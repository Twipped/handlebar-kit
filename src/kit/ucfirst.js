
import { ucfirst as uc } from '../util';

export default function ucfirst () {

	/**
	 * Uppercase the first letter of a string or content block
	 * @category strings
	 * @name ucfirst
	 *
	 * @signature {{ucfirst input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#ucfirst}}<TEMPLATE>{{/ucfirst}}
	 * @return {string}
	 */
	return function ucfirstHelper (...args) {
		const options = args.pop();

		if (options.fn) return uc(options.fn(this));

		if (args.length) {
			return uc(args[0]);
		}

		throw new Error('Handlebars Helper "ucfirst" needs 1 parameter minimum if not used as a block helper');
	};
	/***/
}

export function test (t) {
	// t.simple({
	// });
}
