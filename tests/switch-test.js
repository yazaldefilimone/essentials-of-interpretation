const test = require('./test-utils');

module.exports = (evaluator) => {
	const code = `
  (begin
    (var x 10)
    (switch 
      ((<= x  10) 100)
      ((> x 10) 1000)
      (else 50)
    )
  )
	`;
	test(evaluator, code, 100);

	const codeStore = `
  (begin
    (var x 10)
    (var result 
      (switch 
      ((<= x  10) 100)
      ((> x 10) 1000)
      (else 50)
      )
    )
    result
  )
	`;
	test(evaluator, codeStore, 100);
};
