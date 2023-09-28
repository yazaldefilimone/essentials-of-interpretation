const assert = require('assert');

module.exports = (evaluator) => {
  const code = ['begin', 
    ['var', 'counter', 0],
    ['var', 'result', 0],
    // while
    ['while', ['<', 'counter', 10],
    // todo: implement syntax sugar <++>
      ['begin',
        ['set', 'counter', ['+', 'counter', 1]],
        ['set', 'result', ['+', 'result', 1]]
      ]
    ],
    'result'
  ]
	assert.strictEqual(evaluator.eva(code), 10);
};
