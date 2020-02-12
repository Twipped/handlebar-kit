
export default function injectHelper (Handlebars) {

	/**
	 * Any values passed as named arguments are injected into the handlebars data context, using the name provided for each argument.
	 * @category context
	 * @name inject
	 *
	 * @signature {{inject key=value [key2=value2] ...}}
	 * @describe Inserts into the current context.
	 *
	 * @signature {{#inject key=value [key2=value2] ...}}<TEMPLATE>{{/inject}}
	 * @describe Inserts into the context of the tag block.
	 */

	return function inject (...args) {
		var context = this; // eslint-disable-line

		const options = args.pop();

		if (options.fn) {
			context = Handlebars.createFrame(this || null);
		}

		Object.assign(context, ...args);

		if (options.hash) {
			Object.keys(options.hash).forEach((key) => {

				var value = options.hash[key];
				if (String(value)[0] === '{') {
					value = JSON.parse(value);
				}

				context[key] = value;
			});
		}

		return options.fn && options.fn(context) || '';
	};

	/***/
}

export function test (t) {
	t.multi(
		{
			template: 'a={{a}},[{{#inject c=2}}a={{a}},c={{c}}{{/inject}}],c={{c}}',
			input: { a: 1 },
			output: 'a=1,[a=1,c=2],c=',
		},
		{
			template: 'a={{a}},[{{#inject c=\'{"d":"foo"}\'}}a={{a}},c.d={{c.d}}{{/inject}}],c={{c}}',
			input: { a: 1 },
			output: 'a=1,[a=1,c.d=foo],c=',
		},
	);
}
