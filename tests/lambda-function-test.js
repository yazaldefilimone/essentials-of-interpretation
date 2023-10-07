const test = require('./test-utils');

module.exports = (evaluator) => {
	const code = `(begin
    (def onClick (callback)
      (begin 
        (var x 10)
        (var y 5)
        (callback (+ x y))
      )
    )

    (onClick 
      (lambda (data) 
      (* data 10
      ))
    )
  )
  `;
	// Immediately-Invoked Lambda expression (IIL)

	const code_iil = `
  (begin
    ((lambda (x) (+ x x))  10)
  )
  `;
	const save = `
  (begin
  (var some (lambda (x) (+ x x)))
  (some 10)
  )
  `;

	test(evaluator, code, (10 + 5) * 10);
	test(evaluator, code_iil, 10 + 10);
	test(evaluator, save, 10 + 10);
};
