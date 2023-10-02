const Environment = require('./environment');
const package = require('../package.json');
class Evaluator {
	constructor(globalEnv = GlobalEnvironment) {
		this.globalEnv = globalEnv;
	}

	eva(exp, env = this.globalEnv) {
		if (this._isNumber(exp)) {
			return exp;
		}

		if (this._isString(exp)) {
			return exp.slice(1, -1);
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

		if (this._isVariableName(exp)) {
			return env.lookup(exp);
		}
		// if exp

		if (exp[0] === 'if') {
			const [_tag, condition, consequent, alternative] = exp;
			return this.eva(condition, env) ? this.eva(consequent, env) : this.eva(alternative, env);
		}

		// while loop

		if (exp[0] === 'while') {
			const [_tag, condition, body] = exp;
			let result;
			while (this.eva(condition, env)) {
				result = this.eva(body, env);
			}
			return result;
		}
		// functions calls

		if (Array.isArray(exp)) {
			const fn = this.eva(exp[0], env);
			const args = exp.slice(1).map((ex) => this.eva(ex, env));
			if (typeof fn === 'function') {
				return fn(...args);
			}
			// To-do: user defined functions
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}

	_evalBlock(exp, env) {
		const [_tag, ...expressions] = exp;
		return expressions.reduce((_, exp) => this.eva(exp, env), null);
	}
	_isNumber(exp) {
		return typeof exp === 'number';
	}

	_isString(exp) {
		return typeof exp === 'string' && exp.at(0) == '"' && exp.at(-1) == '"';
	}

	_isVariableName(exp) {
		return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
	}
}
// default env

function minus(op1, op2 = null) {
	if (op2 == null) return -op1;
	return op1 - op2;
}

const internal = [
	['null', null],
	['true', true],
	['false', false],
	['VERSION', package.version],
	['+', (op1, op2) => op1 + op2],
	['*', (op1, op2) => op1 * op2],
	['/', (op1, op2) => op1 / op2],
	['=', (op1, op2) => op1 === op2],
	['>', (op1, op2) => op1 > op2],
	['>=', (op1, op2) => op1 >= op2],
	['<', (op1, op2) => op1 < op2],
	['<=', (op1, op2) => op1 <= op2],
	['-', minus],
	['print', (...args) => console.log(...args)],
];
 const GlobalEnvironment = new Environment(new Map(internal));


module.exports = Evaluator;
