
export default function contentHelper () {

	/**
	 * Replaces the contents of a layout block with the contained content
	 * @category layout
	 * @name content
	 *
	 * @signature {{#block name}}<TEMPLATE>{{/block}}
	 * @param  {string} name    Name of the block to fill
	 * @return {null}
	 */
	return function content (...args) {
		if (args.length === 1) {
			throw new Error('Handlebars Helper "content" needs 1 parameter');
		}

		const options = args.pop();
		const name = args[0];

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: args[1] || 'replace',
			fn: options.fn,
		};
	};
	/***/
}
