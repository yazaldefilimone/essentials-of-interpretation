const assert = require('assert');
const evalParser = require('../src/parser');

const test = function (evaluator, code, expected) {
	const exp = evalParser.parse(`(begin ${code})`);
	assert.strictEqual(evaluator.evalGlobal(exp), expected);
};
module.exports = test;
