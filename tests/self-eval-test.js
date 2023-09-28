const assert = require('assert');

module.exports = (evaluator) => {
	// Number
	assert.strictEqual(evaluator.eva(1), 1);
	// String
	assert.strictEqual(evaluator.eva('"Hello"'), 'Hello');
};
