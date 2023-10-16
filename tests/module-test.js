const test = require('./test-utils');

module.exports = (evaluator) => {
	const code = `
  (import Math)

  ((prop Math abs) (- 10))

  `;
	const expected = 10;
	test(evaluator, code, expected);
	const case_two = `
  (import (abs) Math)
  (abs (- 8))
  `;
	test(evaluator, case_two, 8);
	const code_three = `
  (import (MAX_VALUE abs) Math)
  (abs (- MAX_VALUE))
  `;
	test(evaluator, code_three, 1000);
};
