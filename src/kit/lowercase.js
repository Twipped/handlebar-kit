
export default function lowercaseHelper () {

	/**
	 * Lowercase the a string or content block
	 * @category strings
	 * @name lowercase
	 *
	 * @signature {{lowercase input}}
	 * @param  {string} input
	 * @return {string}
	 *
	 * @signature {{#lowercase}}<TEMPLATE>{{/lowercase}}
	 * @return {string}
	 */
	return function lowercase (...args) {
		const options = args.pop();

		if (options.fn) return String(options.fn(this)).toLowerCase();

		if (args.length) {
			return String(args[0]).toLowerCase();
		}

		throw new Error('Handlebars Helper "lowercase" needs 1 parameter minimum if not used as a block helper');
	};
	/***/
}

export function test (t) {
	t.multi(
		{
			template: '{{lowercase a}}',
			input: { a: 'PRAESENT COMMODO CURSUS MAGNA, VEL SCELERISQUE NISL CONSECTETUR ET' },
			output: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et',
		},
		{
			template: '{{#lowercase}}{{a}}{{/lowercase}}',
			input: { a: 'PRAESENT COMMODO CURSUS MAGNA, VEL SCELERISQUE NISL CONSECTETUR ET' },
			output: 'praesent commodo cursus magna, vel scelerisque nisl consectetur et',
		},
	);
}
