
export default function blockHelper (Handlebars) {

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
	return function block (...args) {
		if (args.length === 1) {
			throw new Error('Handlebars Helper "block" needs 1 parameter');
		}

		const options = args.pop();
		const name = args[0];

		this._blocks = this._blocks || {};

		var target = this._blocks[name];

		var optionsFn = options.fn || function () { return ''; };

		var result;
		switch (target && target.fn && target.mode) {
		case 'append':
			result = optionsFn(this) + target.fn(this);
			break;
		case 'prepend':
			result = target.fn(this) + optionsFn(this);
			break;
		case 'replace':
			result = target.fn(this);
			break;
		default:
			result = optionsFn(this);
			break;
		}

		return new Handlebars.SafeString(result);
	};
	/***/
}

