const test = require('./test-utils');

module.exports = (evaluator) => {
	const code = `
    (class Point null
      (begin
        (def constructor (this x y)
          (begin
            (set (prop this x) x)
            (set (prop this y) y)
          )
        )
        (def calc (this)
          (+ (prop this x) (prop this y))
        )
      )
    )
    (var point (new Point 10 20))
   ((prop point calc) point)
	`;
	test(evaluator, code, 30);
	const codeCaseTwo = `
    (class Point3D Point
      (begin
        (def constructor (this x y z) 

          (begin
                    ((prop (super Point3D) constructor) this x y)
            (set (prop this z) z)))

        (def calc (this)
          (+ ((prop (super Point3D) calc) this)
             (prop this z)))
      )
    )

    (var p (new Point3D 20 20 30))

    ((prop p calc) p)
	`;
	test(evaluator, codeCaseTwo, 70);
};
