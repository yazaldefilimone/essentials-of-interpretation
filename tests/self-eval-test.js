const assert = require('assert');

module.exports = (evaluator) => {
	// Number
	assert.strictEqual(evaluator.eval(1), 1);
	// String
	assert.strictEqual(evaluator.eval('"Hello"'), 'Hello');
};
