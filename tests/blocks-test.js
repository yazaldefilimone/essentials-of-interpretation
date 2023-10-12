const assert = require('assert');

module.exports = (evaluator) => {
	//  blocks

	assert.strictEqual(
		evaluator.eval(['begin', ['var', 'x', 10], ['var', 'y', 20], ['+', ['*', 'x', 'y'], 30]]),
		230,
	);

	assert.strictEqual(
		evaluator.eval(['begin', ['var', 'x', 10], ['begin', ['var', 'x', 20], 'x'], 'x']),
		10,
	);

	assert.strictEqual(
		evaluator.eval([
			'begin',
			// main scop
			['var', 'y', 2],
			[
				'var',
				'b',
				[
					'begin',
					// second scop
					['var', 'x', ['+', 'y', 10]],
					'x',
				],
			],
			'b',
		]),
		12,
	);
};
