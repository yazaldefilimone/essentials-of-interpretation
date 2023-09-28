const assert = require('assert');

module.exports = (evaluator) => {
	// Adicional Operator
	assert.strictEqual(evaluator.eva(['+', 2, 2]), 4);
	assert.strictEqual(evaluator.eva(['+', ['+', 1, 2], 2]), 5);
	// Multiplication
	assert.strictEqual(evaluator.eva(['*', ['*', 2, 2], 2]), 8);
	//
	assert.strictEqual(evaluator.eva(['*', ['+', 1, 2], 2]), 6);
};
