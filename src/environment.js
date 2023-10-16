const { createMap } = require('./utils');

class Environment {
	constructor(record = {}, parent = null) {
		this.record = createMap(record);
		this.parent = parent;
	}
	define(name, value) {
		this.record.set(name, value);
		return value;
	}
	lookup(name) {
		return this.resolve(name).record.get(name);
	}
	internalLookup(name) {
		return this.internalResolve(name)?.record?.get(name) || null;
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
	internalResolve(name) {
		if (this.record.has(name)) {
			return this;
		}
		if (this.parent !== null) {
			return this.parent.resolve(name);
		}
		return null;
	}
}

module.exports = Environment;
