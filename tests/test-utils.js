const assert = require('assert');
const evalParser = require('../src/parser');

const test = function (evaluator, code, expected) {
	const exp = evalParser.parse(code);
	assert.strictEqual(evaluator.eva(exp), expected);
};
module.exports = test;
