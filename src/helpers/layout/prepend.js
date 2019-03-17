
exports.prepend = function () {

	/**
	 * Prepends the contained content onto a layout block.
	 * @category layout
	 * @name prepend
	 *
	 * @signature {{#prepend name}}<TEMPLATE>{{/prepend}}
	 * @param  {string} name    Name of the content block to prepend to
	 * @return {null}
	 */
	return function prepend (name, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "prepend" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: 'prepend',
			fn: options.fn,
		};
	};
};
