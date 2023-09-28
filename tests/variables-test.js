const assert = require('assert');
const package = require('../package.json');

module.exports = (evaluator) => {
	// variable
	assert.strictEqual(evaluator.eva(['var', 'x', 10]), 10);
	assert.strictEqual(evaluator.eva('x'), 10);
	assert.strictEqual(evaluator.eva(['var', 'x', ['*', ['+', 1, 2], 2]]), 6);
	assert.strictEqual(evaluator.eva('VERSION'), package.version);
	assert.strictEqual(evaluator.eva(['var', 'isTrue', 'true']), true);
	// assign
	assert.strictEqual(
		evaluator.eva(['begin', 
    ['var', 'x', 10], 
    ['begin', 
    ['set', 'x', 20], 'x'], 
    'x']
    ),
		20,
	);
};
