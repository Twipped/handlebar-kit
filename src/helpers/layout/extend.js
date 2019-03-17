
exports.extend = function (Handlebars) {

	/**
	 * Defines collection of layout cells to be filled into a layout partial. This function wraps a
	 * series of `append`, `prepend` and `content` calls. The content instructions inside are evaluated
	 * and then the named partial is evaluated using the data defined by those instructions. All other
	 * contained text is disposed of.
	 * @category layout
	 * @name extend
	 *
	 * @signature {{#extend name}}<TEMPLATE>{{/extend}}
	 * @param  {string} layout  The name of the Handlebars partial to be used.
	 * @return {string}
	 */
	return function extend (layout, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "extend" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		var context = Object.create(this || null);
		var template = Handlebars.partials[layout];

		if (typeof template === 'undefined') {
			throw new Error("Missing layout: '" + layout + "'");
		}

		if (typeof template === 'string') {
			template = Handlebars.compile(template);
		}

		if (options.fn) {
			// run the contents of the embed so that the content blocks apply
			// but don't use the output.
			options.fn(context);
		}

		return new Handlebars.SafeString(template(context));
	};
};
