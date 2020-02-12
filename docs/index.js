
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const dox = require('dox');
const Handlebars = require('handlebars');
const Kit = require('../dist');
const { flatten, map, sort } = require('../util');
const markdown = require('markdown-it');
const mdAnchor = require('markdown-it-anchor');
const mdHighlight = require('markdown-it-highlightjs');

Kit.load(Handlebars);

var template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, 'template.hbs.html')).toString('utf8'));

const md     = markdown({
	html: true,
	linkify: true,
	typographer: true,
}).enable('image')
	.use(mdAnchor)
	.use(mdHighlight)
;

/** Build Changelog
*******************************************************************************************/
// var changelog = fs.readFileSync(__dirname + '/../CHANGELOG.md').toString('utf8');
// var changelog = (new commonmark.Parser()).parse(changelog);
// var walker = changelog.walker();
// var block, node;
// while ((block = walker.next())) {
// 	node = block.node;
// 	if (node.type === 'Header' && node.level === 1) {
// 		node.level = 3;
// 	}
// }
// changelog = (new commonmark.HtmlRenderer()).render(changelog);


/** Build Docs
*******************************************************************************************/

var files = glob.sync('src/kit/*.js', { cwd: path.dirname(__dirname) });

files = files.map((filename) => {
	const contents = fs.readFileSync(filename).toString('utf8');
	let parsed;
	try {
		parsed = dox.parseComments(contents, { raw: true });
	} catch (e) {
		parsed = null;
		console.error('Error while parsing ' + filename, e);
	}
	return {
		filename,
		// contents,
		parsed,
	};
});

var parents = {};
var parentless = {
	categories: {},
	uncategorized: [],
};

function processParsedItem (filename, item) {
	if (!item.ctx) {
		// If there's no context, then it's an extra chunk we don't care about
		item.ignore = true;
		return;
	}

	item.filename = filename;

	item.description.full = md.render(item.description.full);

	item.signatures = [];
	item.aliases = [];

	var currentSignature;

	function addSignature () {
		if (!currentSignature) return; // nothing to add

		if (!currentSignature.signature) {
			currentSignature.signature =
				(item.ctx.parent && item.ctx.parent + '.' || '') +
				item.ctx.name + '(' +
				currentSignature.params.map((p) => (p.optional ? '[' + p.name + ']' : p.name)).join(', ') +
				')';
		}

		item.signatures.push(currentSignature);
	}

	function ensureSignature () {
		if (!currentSignature) {
			currentSignature = {
				signature: '',
				params: [],
				examples: [],
				returns: '',
			};
		}
	}

	// process tags
	item.tags.forEach((tag) => {
		var i;
		switch (tag.type) {
		case 'name':
			item.ctx.name = tag.string;
			break;
		case 'memberOf':
			item.ctx.parent = tag.parent;
			break;
		case 'category':
			item.category = tag.string.trim().split(/,\s*/);
			break;
		case 'alias':
			item.aliases.push(tag.string);
			break;
		case 'constructor':
			item.isConstructor = true;
			break;
		case 'abstract':
			item.isAbstract = true;
			break;
		case 'deprecated':
			item.isDeprecated = tag.string;
			break;

		case 'param':
			ensureSignature();

			if ((tag.optional = tag.name[0] === '[')) {
				tag.name = tag.name.substring(1, tag.name.length - 1);
			}

			i = tag.name.indexOf('=');
			if (i > 0) {
				tag.default = tag.name.substring(i + 1);
				tag.name = tag.name.substring(0, i);
			}

			tag.types = tag.types.join(', ');

			currentSignature.params.push(tag);
			break;
		case 'signature':
			addSignature();
			currentSignature = {
				signature: tag.string,
				params: [],
				examples: [],
			};
			break;
		case 'describe':
			ensureSignature();
			currentSignature.description = md.render(tag.string.trim());
			break;
		case 'example':
			ensureSignature();
			currentSignature.examples.push(tag.string.trim());
			break;
		case 'return':
			ensureSignature();
			tag.types = tag.types.join(', ');
			currentSignature.returns = tag;
			break;
		default:
			// do nothing
		}
	});

	// If no signature was ever created, then make one up using the function header
	if (!currentSignature) {
		ensureSignature();
		currentSignature.signature = (item.ctx.parent && item.ctx.string.indexOf(item.ctx.parent) !== 0 && item.ctx.parent + '.' || '') + item.ctx.string;
	}

	// add any left over signature
	addSignature();

	// we don't care about declarations
	if (item.ctx.type === 'declaration') {
		item.ignore = true;
	}

	// convert code tabs to spaces
	item.code = item.code.replace(/\t/g, '  ').replace(/^return /m, '');

	// generate the name and id for the template
	item.name = (item.ctx.parent && item.ctx.parent + '.' || '') + item.ctx.name;
	item.id = item.ctx.type + (item.ctx.parent && item.ctx.parent || '') + item.ctx.name;

	// Find which parent the function belongs to
	var parentBranch;
	if (item.ctx.parent) {
		parentBranch = parents[item.ctx.parent] || (parents[item.ctx.parent] = {
			name: item.ctx.parent || '',
			categories: {},
			uncategorized: [],
		});
	} else if (item.isConstructor) {
		parents[item.ctx.name] = {
			name: item.ctx.name,
			categories: {},
			uncategorized: [],
			item,
		};
		return;
	} else {
		parentBranch = parentless;
	}

	const categories = [];
	// If the function is categorized, find its category
	if (item.category && item.category.length) {
		for (const cat of item.category) {
			const category = parentBranch.categories[cat] || (parentBranch.categories[cat] = []);
			categories.push(category);
		}
	} else {
		categories.push(parentBranch.uncategorized);
	}
	categories.forEach((category) => category.push(item));

	item.aliases.forEach((alias) => {
		var achunk = Handlebars.createFrame(item);
		achunk.name = (item.ctx.parent && item.ctx.parent + '.' || '') + alias;
		achunk.original = item.name;
		achunk.isAlias = true;
		categories.forEach((category) => category.push(achunk));
	});

	item.aliases = item.aliases.join(', ');
}

files.forEach((file) => file.parsed.forEach((item) => processParsedItem(file.filename, item)));

const pieces = sort(flatten(map(files, 'parsed'), 1), 'name');

// Save the documentation data for reference
fs.writeFileSync(path.resolve(__dirname, 'hk.json'), JSON.stringify(pieces, undefined, 2));

parentless.categories = sort(parentless.categories);

fs.writeFileSync(path.resolve(__dirname, 'index.html'), template({
	pieces,
	parents,
	parentless,
	changelog: null,
}));
