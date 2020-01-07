
export default function prependHelper () {

	/**
	 * Prepends the contained content onto a layout block.
	 * @category layout
	 * @name prepend
	 *
	 * @signature {{#prepend name}}<TEMPLATE>{{/prepend}}
	 * @param  {string} name    Name of the content block to prepend to
	 * @return {null}
	 */
	return function prepend (...args) {
		if (args.length === 1) {
			throw new Error('Handlebars Helper "prepend" needs 1 parameter');
		}

		const options = args.pop();
		const name = args[0];

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: 'prepend',
			fn: options.fn,
		};
	};
	/***/
}
