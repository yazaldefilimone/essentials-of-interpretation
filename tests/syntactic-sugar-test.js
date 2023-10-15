const test = require('./test-utils');

module.exports = (evaluator) => {
	const code = `(begin
    (var x 10)
    (print x)
    (+= x 4)
    x
  )
	`;
	test(evaluator, code, 14);
};
