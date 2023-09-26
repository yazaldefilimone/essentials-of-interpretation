const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Environment = require('./environment');

class Evaluator {
	constructor(globalEnv = new Environment()) {
		this.globalEnv = globalEnv;
	}

	eva(exp, env = this.globalEnv) {
		if (isNumber(exp)) {
			return exp;
		}

		if (isString(exp)) {
			return exp.slice(1, -1);
		}

		if (exp[0] === '+') {
			return this.eva(exp[1], env) + this.eva(exp[2], env);
		}
		if (exp[0] === '*') {
			return this.eva(exp[1], env) * this.eva(exp[2], env);
		}
		// Block: sequence of expressions
		if (exp[0] === 'begin') {
			const parentEnv = new Environment(new Map(), env);
			return this._evalBlock(exp, parentEnv);
		}

		// assign declaration
		if (exp[0] === 'set') {
			const [_, name, value] = exp;
			return env.assign(name, this.eva(value, env));
		}
		// Variable declaration
		if (exp[0] === 'var') {
			const [_, name, value] = exp;
			return env.define(name, this.eva(value, env));
		}

		if (isVariableName(exp)) {
			return env.lookup(exp);
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}

	_evalBlock(exp, env) {
		const [_tag, ...expressions] = exp;
		return expressions.reduce((_, exp) => this.eva(exp, env), null);
	}
}

function isNumber(exp) {
	return typeof exp === 'number';
}

function isString(exp) {
	return typeof exp === 'string' && exp.at(0) == '"' && exp.at(-1) == '"';
}

function isVariableName(exp) {
	return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
}

// Tests
const package = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, '../package.json'), {
		encoding: 'utf-8',
	}),
);
const internalEnv = [
	['null', null],
	['true', true],
	['false', false],
	['VERSION', package.version],
];
const table = new Map(internalEnv);
const environment = new Environment(table);
const evaluator = new Evaluator(environment);
// Number
assert.strictEqual(evaluator.eva(1), 1);
// String
assert.strictEqual(evaluator.eva('"Hello"'), 'Hello');

// Adicional Operator
assert.strictEqual(evaluator.eva(['+', 2, 2]), 4);
assert.strictEqual(evaluator.eva(['+', ['+', 1, 2], 2]), 5);
// Multiplication
assert.strictEqual(evaluator.eva(['*', ['*', 2, 2], 2]), 8);
//
assert.strictEqual(evaluator.eva(['*', ['+', 1, 2], 2]), 6);

// variable
assert.strictEqual(evaluator.eva(['var', 'x', 10]), 10);
assert.strictEqual(evaluator.eva('x'), 10);
assert.strictEqual(evaluator.eva(['var', 'x', ['*', ['+', 1, 2], 2]]), 6);
assert.strictEqual(evaluator.eva('VERSION'), package.version);
assert.strictEqual(evaluator.eva(['var', 'isTrue', 'true']), true);

//  blocks

assert.strictEqual(
	evaluator.eva(['begin', ['var', 'x', 10], ['var', 'y', 20], ['+', ['*', 'x', 'y'], 30]]),
	230,
);

assert.strictEqual(
	evaluator.eva(['begin', ['var', 'x', 10], ['begin', ['var', 'x', 20], 'x'], 'x']),
	10,
);

assert.strictEqual(
	evaluator.eva([
		'begin',
		// main scop
		['var', 'y', 2],
		[
			'var',
			'b',
			[
				'begin',
				// second scop
				['var', 'x', ['+', 'y', 10]],
				'x',
			],
		],
		'b',
	]),
	12,
);
// assign
assert.strictEqual(
	evaluator.eva(['begin', ['var', 'x', 10], ['begin', ['set', 'x', 20], 'x'], 'x']),
	20,
);

console.log('All tests passed!');
