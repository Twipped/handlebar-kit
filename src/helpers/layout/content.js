
exports.content = function () {

	/**
	 * Replaces the contents of a layout block with the contained content
	 * @category layout
	 * @name content
	 *
	 * @signature {{#block name}}<TEMPLATE>{{/block}}
	 * @param  {string} name    Name of the block to fill
	 * @return {null}
	 */
	return function content (name, options) {
		if (arguments.length === 1) {
			throw new Error('Handlebars Helper "content" needs 1 parameter');
		}

		options = arguments[arguments.length - 1];

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: 'replace',
			fn: options.fn,
		};
	};
};
