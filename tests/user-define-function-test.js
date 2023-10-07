const assert = require('assert');
const  test  = require('./test-utils');

module.exports = (evaluator) => {
	// Number
  const code =  `(begin
    (def square (x)
      (* x x)
    )
    (var x 10)
    (square 20)
  )
  `
  test(evaluator,code, 20 * 20)
  // closure
    const codeClosure =  `(begin
      (var global 10)
      (def calc (x y)
        (begin
          (var z (+ x y))
          (def inner (foobar)
            (+ (+ foobar z) global )
          )
          inner
        )
      )
      (var fn (calc 10 5))
      (var result (fn 2))
      (print (+ "o resultado e: " result))
      result
  )
  `
  test(evaluator,codeClosure, 10 + 5 + 2 + 10)

  // recursion
  const recursion =  `(begin
   (def recursion (x)
      (if (= x 1)
        1
        (* x  (recursion (- x 1)))
      )
   )
   (recursion 5)
  )
  `
  console.time('recursion')
  test(evaluator,recursion, 120)
  console.timeEnd('recursion')

};
