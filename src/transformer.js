// JIT - transpile
class Transformer {
	transformDefToLambda(defExp) {
		const [_tag, name, params, body] = defExp;
		return ['var', name, ['lambda', params, body]];
	}
}

module.exports = Transformer;
