
exports.block = function (Handlebars) {

	/**
	 * Defines a pluggable content block in a layout partial
	 * @category layout
	 * @name block
	 *
	 * @signature {{block name}}
	 * @param  {string} name    Name of the block
	 * @return {string} Defines an area for content to be inserted.`
	 *
	 * @signature {{#block name}}<TEMPLATE>{{/block}}
	 * @param  {string} name    Name of the block
	 * @return {string} Defines an area of content that can be appended, prepended, or replaced.`
	 */
	return function block (name, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "block" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		this._blocks = this._blocks || {};

		var block = this._blocks[name];

		var optionsFn = options.fn || function () { return ''; };

		var result;
		switch (block && block.fn && block.mode) {
		case 'append':
			result = optionsFn(this) + block.fn(this);
			break;
		case 'prepend':
			result = block.fn(this) + optionsFn(this);
			break;
		case 'replace':
			result = block.fn(this);
			break;
		default:
			result = optionsFn(this);
			break;
		}

		return new Handlebars.SafeString(result);
	};
};
