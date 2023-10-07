const test = require('./test-utils');

module.exports = (evaluator) => {
	const code = `(begin
   (print "----for-----")
   (for (var x 1) (< x  10) (++ x) (print x))
   (print "---------")
  (for (var x 10) (> x  0) (-- x) (print x))
   (print "----end for-----")

  )
	`;
	test(evaluator, code, undefined);
};
