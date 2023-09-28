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

const internalEnv = [
	['null', null],
	['true', true],
	['false', false],
	['VERSION', package.version],
];
const table = new Map(internalEnv);
const environment = new Environment(table);
const evaluator = new Evaluator(environment);
tests.forEach((test) => test(evaluator));
console.log('All tests passed!');
