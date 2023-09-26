class Environment {
	constructor(record = new Map(), parent = null) {
		this.record = record;
		this.parent = parent;
	}
	define(name, value) {
		this.record.set(name, value);
		return value;
	}
	lookup(name) {
		return this.resolve(name).record.get(name);
	}
	assign(name, value) {
		this.resolve(name).record.set(name, value);
	}

	resolve(name) {
		if (this.record.has(name)) {
			return this;
		}
		if (this.parent !== null) {
			return this.parent.resolve(name);
		}
		throw ReferenceError(`Variable ${name} is not defined!`);
	}
}

module.exports = Environment;
