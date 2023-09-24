
class Environment {
  constructor(record = new Map()) {
    this.record = record
  }
  define(name, value) {
    this.record.set(name, value)
    return value
  }
  lookup(name) {
    if (!this.record.has(name)) {
      throw ReferenceError(`Variable ${name} is not defined!`)
    }
    return this.record.get(name)
  }
}


module.exports = Environment