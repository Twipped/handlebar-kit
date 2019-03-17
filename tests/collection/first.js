
var makeTests = require('../testBuilder.js');

module.exports = makeTests([
	{
		template: '{{first a }}',
		input: { a: [ 3, 2, 1 ] },
		output: '3',
	},
	{
		template: '{{first a 2}}',
		input: { a: [ 3, 2, 1 ] },
		output: '3,2',
	},
	{
		template: '{{#first a 2}}|{{@key}},{{@index}},{{this}}|{{else}}no{{/first}}',
		input: { a: [ 3, 2, 1 ] },
		output: '|0,0,3||1,1,2|',
	},
	{
		template: '{{#first a 2}}|{{this}}|{{else}}no{{/first}}',
		input: { a: [] },
		output: 'no',
	},
	{
		template: '{{#first a 2}}|{{@key}},{{@index}},{{this}}|{{else}}no{{/first}}',
		input: { a: { a: 3, b: 2, c: 1 } },
		output: '|a,0,3||b,1,2|',
	},
]);
