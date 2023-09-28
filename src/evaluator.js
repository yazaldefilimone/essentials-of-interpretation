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

		// Math
		if (exp[0] === '*') {
			return this.eva(exp[1], env) * this.eva(exp[2], env);
		}
		if (exp[0] === '+') {
			return this.eva(exp[1], env) + this.eva(exp[2], env);
		}
		if (exp[0] === '>') {
			return this.eva(exp[1], env) > this.eva(exp[2], env);
		}
		if (exp[0] === '<') {
			return this.eva(exp[1], env) < this.eva(exp[2], env);
		}
		// Compare
		if (exp[0] === '>=') {
			return this.eva(exp[1], env) >= this.eva(exp[2], env);
		}
		if (exp[0] === '<=') {
			return this.eva(exp[1], env) <= this.eva(exp[2], env);
		}
		if (exp[0] === '=') {
			return this.eva(exp[1], env) === this.eva(exp[2], env);
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

module.exports = Evaluator;
