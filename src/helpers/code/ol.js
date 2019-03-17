
exports.ol = function (Handlebars) {
	/**
	 * Generate an ordered list
	 * @category code
	 * @signature {{ol items}}
	 * @param  {array<mixed>} input   Items to be iterated over, outputting directly to as LI contents.
	 *
	 * @signature {{#ol items}}<TEMPLATE>[{{else}}<TEMPLATE>]{{/ol}}
	 * @param  {array<mixed>} input Items to apply the enclosed template against to produce LI contents.
	 * @example
	 * {{#ol emails class="email-list"}}<a href="mailto:{{this}}">{{this}}</a>{{else}}There are no emails.{{/ol}}
	 */
	return function ol (input, options) {
		options = arguments[arguments.length - 1];

		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "ol" needs 1 parameter');
		}

		var stack = [ '<ol' ];

		if (options.hash) {
			Object.keys(options.hash).forEach((key) => {
				stack.push(' ' + key + '="' + options.hash[key] + '"');
			});
		}

		stack.push('>');

		if (!Array.isArray(input)) {
			input = [ input ];
		}

		if (!options.fn) {
			input.forEach((item) => {
				stack.push('<li>' + Handlebars.Utils.escapeExpression(item) + '</li>');
			});
		} else if (input.length) {
			var data = Handlebars.createFrame(options.data);
			input.forEach((item, i) => {
				data.index = i;
				data.first = (i === 0);
				data.last  = (i === input.length - 1);
				stack.push('<li>' + options.fn(item, { data }) + '</li>');
			});
		} else {
			stack.push('<li>' + options.inverse(this) + '</li>');
		}

		stack.push('</ol>');

		return new Handlebars.SafeString(stack.join(''));
	};
	/***/
};
