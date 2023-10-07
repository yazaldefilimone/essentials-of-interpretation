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
}

module.exports = Transformer;
