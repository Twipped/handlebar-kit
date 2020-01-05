
import { ucwords as uc } from '../util';

export default function ucwords () {

	/**
	 * Uppercase the first letter of every word in a string or content block
	 * @category strings
	 * @name ucwords
	 *
	 * @signature {{ucwords input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#ucwords}}<TEMPLATE>{{/ucwords}}
	 * @return {string}
	 */
	return function ucwordsHelper (...args) {
		const options = args.pop();

		if (options.fn) return uc(options.fn(this));

		if (args.length) {
			return uc(args[0]);
		}

		throw new Error('Handlebars Helper "ucwords" needs 1 parameter minimum if not used as a block helper');
	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{ucwords a}}',
			input: { a: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et' },
			output: 'Praesent Commodo Cursus Magna, Vel Scelerisque Nisl Consectetur Et',
		},
		{
			template: '{{#ucwords}}{{a}}{{/ucwords}}',
			input: { a: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et' },
			output: 'Praesent Commodo Cursus Magna, Vel Scelerisque Nisl Consectetur Et',
		},
	);
}
