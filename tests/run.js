// Tests
const blockTest = require('./blocks-test');
const mathTest = require('./math-test');
const selfEvalTest = require('./self-eval-test');
const variablesTest = require('./variables-test');
const ifExpTest = require('./if-exp-test');
const whileTest = require('./while-test');
const userDefineFunction = require('./user-define-function-test');
const lambdaFunction = require('./lambda-function-test.js');

const tests = [
	blockTest,
	mathTest,
	selfEvalTest,
	variablesTest,
	ifExpTest,
	whileTest,
	userDefineFunction,
  lambdaFunction
];

const Evaluator = require('../src/evaluator');
// Tests
const evaluator = new Evaluator();
tests.forEach((test) => test(evaluator));
evaluator.eva(['print', '"Hello,"', '"World!"']);
console.log('All tests passed!');
