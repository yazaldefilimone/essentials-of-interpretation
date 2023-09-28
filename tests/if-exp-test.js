const assert = require('assert');

/*
 (if <condition>
    <consequent>
    <alternative>
 )
*/

module.exports = (evaluator) => {
	const code = [
		'begin',
		['var', 'x', 10],
		['var', 'y', 0],
		['if', ['>', 'y', 10],
			['set', 'y', 20], 
			['set', 'y', 30]
		],
		'y',
	];
	assert.strictEqual(evaluator.eva(code), 30);
};
