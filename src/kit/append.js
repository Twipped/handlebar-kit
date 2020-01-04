
export default function append () {

	/**
	 * Appends the contained content to a layout block
	 * @category layout
	 * @name append
	 *
	 * @signature {{#append name}}<TEMPLATE>{{/append}}
	 * @param  {string} name    Name of the content block to append to
	 * @return {null}
	 */
	return function appendHelper (...args) {
		if (args.length === 1) {
			throw new Error('Handlebars Helper "append" needs 1 parameter');
		}

		const options = args.pop();
		const name = args[0];

		this._blocks = this._blocks || {};

		this._blocks[name] = {
			mode: 'append',
			fn: options.fn,
		};
	};
	/***/
}
