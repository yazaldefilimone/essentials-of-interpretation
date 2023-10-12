const assert = require('assert');
const package = require('../package.json');

module.exports = (evaluator) => {
	// variable
	assert.strictEqual(evaluator.eval(['var', 'x', 10]), 10);
	assert.strictEqual(evaluator.eval('x'), 10);
	assert.strictEqual(evaluator.eval(['var', 'x', ['*', ['+', 1, 2], 2]]), 6);
	assert.strictEqual(evaluator.eval('VERSION'), package.version);
	assert.strictEqual(evaluator.eval(['var', 'isTrue', 'true']), true);
	// assign
	assert.strictEqual(
		evaluator.eval(['begin', ['var', 'x', 10], ['begin', ['set', 'x', 20], 'x'], 'x']),
		20,
	);
};
