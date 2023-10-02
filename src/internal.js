const package = require('../package.json');
const Environment = require('./environment');

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
];

module.exports = new Environment(new Map(internal));
