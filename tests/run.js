// Tests
const blockTest = require('./blocks-test');
const mathTest = require('./math-test');
const selfEvalTest = require('./self-eval-test');
const variablesTest = require('./variables-test');
const ifExpTest = require('./if-exp-test');
const whileTest = require('./while-test');

const tests = [blockTest, mathTest, selfEvalTest, variablesTest, ifExpTest, whileTest];

const Evaluator = require('../src/evaluator');
const Environment = require('../src/environment');
const package = require('../package.json');
// Tests

const evaluator = new Evaluator();
tests.forEach((test) => test(evaluator));
evaluator.eva(['print', '"Hello,"', '"World!"'])
console.log('All tests passed!');
