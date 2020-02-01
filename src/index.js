
import * as kit from './kit';
export * from './kit';

export function load (Handlebars, ...names) {
	// if no helpers were defined, load all of them.
	if (!names || !names.length) {
		names = Object.keys(kit);
	}

	for (const name of names) {
		const helper = kit[name].call(this, Handlebars);
		Handlebars.registerHelper(name, helper);
	}
}

export default {
	load,
	...kit,
};
