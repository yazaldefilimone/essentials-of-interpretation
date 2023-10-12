const Environment = require('./environment');
const Transformer = require('./transformer');
const package = require('../package.json');
class Evaluator {
	constructor(globalEnv = GlobalEnvironment) {
		this.globalEnv = globalEnv;
		this._transformer = new Transformer();
	}
	evalGlobal(expressions) {
		return this._evalBlock(['block', expressions], this.globalEnv);
	}
	eval(exp, env = this.globalEnv) {
		if (this._isNumber(exp)) {
			return exp;
		}

		if (this._isString(exp)) {
			return exp.slice(1, -1);
		}
		// Block: sequence of expressions
		if (exp[0] === 'begin') {
			const parentEnv = new Environment({}, env);
			return this._evalBlock(exp, parentEnv);
		}

		// assign declaration
		if (exp[0] === 'set') {
			const [_tag, ref, value] = exp;
			if (ref[0] === 'prop') {
				const [_tag, instance, propName] = ref;
				const classEnv = this.eval(instance, env);
				return classEnv.define(propName, this.eval(value, env));
			}
			return env.assign(ref, this.eval(value, env));
		}
		// Variable declaration
		if (exp[0] === 'var') {
			const [_, name, value] = exp;
			const ev = this.eval(value, env);
			return env.define(name, ev);
		}

		if (this._isVariableName(exp)) {
			return env.lookup(exp);
		}
		// if exp

		if (exp[0] === 'if') {
			const [_tag, condition, consequent, alternative] = exp;
			return this.eval(condition, env) ? this.eval(consequent, env) : this.eval(alternative, env);
		}

		// while loop

		if (exp[0] === 'while') {
			const [_tag, condition, body] = exp;
			let result;
			while (this.eval(condition, env)) {
				result = this.eval(body, env);
			}
			return result;
		}

		// user define func: (def name (x) ())

		if (exp[0] === 'def') {
			// JIT - transpile to variable declaration
			return this.eval(this._transformer.defToLambda(exp), env);
		}
		// lambda function
		if (exp[0] === 'lambda') {
			const [_tag, params, body] = exp;
			return {
				params,
				body,
				env,
			};
		}

		// switch
		if (exp[0] == 'switch') {
			const ifExp = this._transformer.switchToIf(exp);
			return this.eval(ifExp, env);
		}
		// for
		if (exp[0] == 'for') {
			const whileExp = this._transformer.forToWhile(exp);
			return this.eval(whileExp, env);
		}
		// increment
		if (exp[0] == '++') {
			const setExp = this._transformer.incrementToSet(exp);
			return this.eval(setExp, env);
		}
		// increment and assign
		if (exp[0] == '+=') {
			const setExp = this._transformer.incrementAssignToSet(exp);
			return this.eval(setExp, env);
		}
		// decrement
		if (exp[0] == '--') {
			const setExp = this._transformer.decrementToSet(exp);
			return this.eval(setExp, env);
		}

		// decrement and assign
		if (exp[0] == '-=') {
			const setExp = this._transformer.decrementAssignToSet(exp);
			return this.eval(setExp, env);
		}
		// class
		if (exp[0] == 'class') {
			const [_tag, name, parent, body] = exp;
			const evalParent = this.eval(parent, env);
			const parentEnv = evalParent || env;
			const classEnv = new Environment({}, parentEnv);
			this._evalBody(body, classEnv);
			return env.define(name, classEnv);
		}
		// class instance
		if (exp[0] == 'new') {
			const [_tag, name, ...params] = exp;
			const classEnv = this.eval(name, env);
			const instance = new Environment({}, classEnv);
			const args = exp.slice(2).map((arg) => this.eval(arg, env));
			this._callUserFunction(classEnv.lookup('constructor'), [instance, ...args]);
			return instance;
		}
		// prop: access methods in class
		if (exp[0] == 'prop') {
			const [_tag, instance, method] = exp;
			const classEnv = this.eval(instance, env);
			return classEnv.lookup(method);
		}
		// super
		if (exp[0] == 'super') {
			const [_tag, className] = exp;
			const { parent } = this.eval(className, env);
			return parent;
		}
		// functions calls
		if (Array.isArray(exp)) {
			const fn = this.eval(exp[0], env);
			const args = exp.slice(1).map((ex) => this.eval(ex, env));
			if (typeof fn === 'function') {
				return fn(...args);
			}
			//user defined functions
			return this._callUserFunction(fn, args);
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}

	_callUserFunction(fn, args) {
		const activationRecord = {};
		fn.params.forEach((variable, position) => {
			activationRecord[variable] = args[position];
		});
		const funEnv = new Environment(activationRecord, fn.env);
		return this._evalBody(fn.body, funEnv);
	}
	_evalBody(exp, env) {
		if (exp[0] === 'begin') {
			return this._evalBlock(exp, env);
		}
		return this.eval(exp, env);
	}
	_evalBlock(exp, env) {
		const [_tag, ...expressions] = exp;
		return expressions.reduce((_, exp) => this.eval(exp, env), null);
	}
	_isNumber(exp) {
		return typeof exp === 'number';
	}

	_isString(exp) {
		return typeof exp === 'string' && exp.at(0) == '"' && exp.at(-1) == '"';
	}

	_isVariableName(exp) {
		return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
	}
}
// default env

function minus(op1, op2 = null) {
	if (op2 == null) return -op1;
	return op1 - op2;
}

const internal = {
	null: null,
	true: true,
	false: false,
	VERSION: package.version,
	'+': (op1, op2) => op1 + op2,
	'*': (op1, op2) => op1 * op2,
	'/': (op1, op2) => op1 / op2,
	'=': (op1, op2) => op1 === op2,
	'>': (op1, op2) => op1 > op2,
	'>=': (op1, op2) => op1 >= op2,
	'<': (op1, op2) => op1 < op2,
	'<=': (op1, op2) => op1 <= op2,
	'-': minus,
	print: (...args) => console.log(...args),
};

const GlobalEnvironment = new Environment(internal);

module.exports = Evaluator;
