// JIT - transpile
class Transformer {
	defToLambda(defExp) {
		const [_tag, name, params, body] = defExp;
		return ['var', name, ['lambda', params, body]];
	}

	switchToIf(switchExp) {
		const [_tag, ...cases] = switchExp;
		const ifExp = ['if', null, null, null];
		let currentIfExp = ifExp;
		for (let index = 0; index < cases.length - 1; index++) {
			const [currentCase, currentBlock] = cases[index];
			currentIfExp[1] = currentCase;
			currentIfExp[2] = currentBlock;
			// next case
			const next = cases[index + 1];
			const [nextCase, nextBlock] = next;
			currentIfExp[3] = nextCase === 'else' ? nextBlock : ['if'];
			currentIfExp = currentIfExp[3];
		}
		return ifExp;
	}

	forToWhile(forExp) {
		const [_tag, initialize, condition, increment, exp] = forExp;
		const expBlock = ['begin', exp, increment];
		const whileExp = ['while', condition, expBlock];
		return ['begin', initialize, whileExp];
	}
	decrementToSet(decrementExp) {
		const [_tag, name] = decrementExp;
		return ['set', name, ['-', name, 1]];
	}
	incrementToSet(incrementExp) {
		const [_tag, name] = incrementExp;
		return ['set', name, ['+', name, 1]];
	}
	decrementAssignToSet(exp) {
		const [_tag, name, value] = exp;
		return ['set', name, ['-', name, value]];
	}
	incrementAssignToSet(exp) {
		const [_tag, name, value] = exp;
		return ['set', name, ['+', name, value]];
	}
}

module.exports = Transformer;
